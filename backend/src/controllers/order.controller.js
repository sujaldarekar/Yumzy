const Order = require('../models/order.model');
const LoyaltyPoints = require('../models/loyaltyPoints.model');
const Food = require('../models/food.model');
const User = require('../models/user.model');
const FoodPartner = require('../models/foodPartnerModel');

// Available coupon codes
const COUPONS = {
  'FIRST10': { discount: 10, type: 'percentage' }, // 10% off
  'SAVE50': { discount: 50, type: 'flat' }, // ₹50 off
  'WELCOME20': { discount: 20, type: 'percentage' } // 20% off
};

// Loyalty points configuration
const LOYALTY_CONFIG = {
  pointsPerRupee: 0.1, // 10 points per ₹100 spent
  rupeePerPoint: 0.1 // 1 point = ₹0.10 discount
};

// Calculate discount based on coupon code
const calculateCouponDiscount = (couponCode, totalAmount) => {
  if (!couponCode || !COUPONS[couponCode.toUpperCase()]) {
    return 0;
  }
  
  const coupon = COUPONS[couponCode.toUpperCase()];
  if (coupon.type === 'percentage') {
    return (totalAmount * coupon.discount) / 100;
  } else if (coupon.type === 'flat') {
    return Math.min(coupon.discount, totalAmount);
  }
  return 0;
};

// Calculate loyalty points discount
const calculateLoyaltyDiscount = (pointsToUse) => {
  return pointsToUse * LOYALTY_CONFIG.rupeePerPoint;
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { foodId, quantity, address, paymentOption, couponCode, loyaltyPointsUsed } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!foodId || !quantity || !address || !paymentOption) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Fetch food item
    const foodItem = await Food.findById(foodId).populate('foodPartner');
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate base amount
    const baseAmount = foodItem.price * quantity;

    // Apply coupon discount
    const couponDiscount = calculateCouponDiscount(couponCode, baseAmount);

    // Validate loyalty points
    const pointsToUse = loyaltyPointsUsed || 0;
    if (pointsToUse > user.loyaltyPoints) {
      return res.status(400).json({ message: 'Insufficient loyalty points' });
    }

    // Calculate loyalty discount
    const loyaltyDiscount = calculateLoyaltyDiscount(pointsToUse);

    // Calculate total discount and final amount
    const totalDiscount = couponDiscount + loyaltyDiscount;
    const finalAmount = Math.max(0, baseAmount - totalDiscount);

    // Calculate estimated delivery time (30-45 minutes from now)
    const estimatedDeliveryTime = new Date(Date.now() + (35 + Math.random() * 10) * 60 * 1000);

    // Create order
    const order = new Order({
      foodItem: foodId,
      user: userId,
      quantity,
      address,
      paymentOption,
      couponCode: couponCode ? couponCode.toUpperCase() : null,
      loyaltyPointsUsed: pointsToUse,
      discountAmount: totalDiscount,
      totalAmount: finalAmount,
      estimatedDeliveryTime,
      foodPartner: foodItem.foodPartner._id
    });

    await order.save();

    // Update user's loyalty points (deduct used points)
    if (pointsToUse > 0) {
      user.loyaltyPoints -= pointsToUse;
      await user.save();

      // Update loyalty points redemption history
      let loyaltyRecord = await LoyaltyPoints.findOne({ user: userId });
      if (loyaltyRecord) {
        loyaltyRecord.redemptionHistory.push({
          order: order._id,
          pointsUsed: pointsToUse
        });
        await loyaltyRecord.save();
      }
    }

    // Award new loyalty points for this order
    const pointsEarned = Math.floor(finalAmount * LOYALTY_CONFIG.pointsPerRupee);
    user.loyaltyPoints += pointsEarned;
    await user.save();

    // Update loyalty points earning history
    let loyaltyRecord = await LoyaltyPoints.findOne({ user: userId });
    if (!loyaltyRecord) {
      loyaltyRecord = new LoyaltyPoints({ user: userId, points: pointsEarned });
    } else {
      loyaltyRecord.points = user.loyaltyPoints;
    }
    
    loyaltyRecord.earnedFromOrders.push({
      order: order._id,
      pointsEarned
    });
    await loyaltyRecord.save();

    res.status(201).json({
      message: 'Order placed successfully',
      order,
      pointsEarned,
      currentLoyaltyPoints: user.loyaltyPoints
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(orderId)
      .populate('foodItem')
      .populate('user', 'fullName email')
      .populate('foodPartner', 'name contactName phone location logo');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow user to view their own orders
    if (order.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.status(200).json({ order });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
};

// Get all orders for logged-in user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate('foodItem')
      .populate('foodPartner', 'name logo')
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });

  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

// Get all orders for logged-in food partner
exports.getPartnerOrders = async (req, res) => {
  try {
    const partnerId = req.foodPartner._id;

    const orders = await Order.find({ foodPartner: partnerId })
      .populate('foodItem')
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });

  } catch (error) {
    console.error('Error fetching partner orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

// Update order status (for food partners or admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};

// Confirm order receipt (for users)
exports.confirmOrderReceipt = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow user to confirm their own orders
    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Update status to Delivered
    order.status = 'Delivered';
    await order.save();

    res.status(200).json({ message: 'Order marked as received', order });

  } catch (error) {
    console.error('Error confirming order receipt:', error);
    res.status(500).json({ message: 'Failed to confirm receipt', error: error.message });
  }
};

// Validate coupon code
exports.validateCoupon = async (req, res) => {
  try {
    const { couponCode, amount } = req.body;

    if (!couponCode) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const discount = calculateCouponDiscount(couponCode, amount || 0);
    
    if (discount === 0) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    res.status(200).json({
      valid: true,
      discount,
      message: `Coupon applied successfully! You saved ₹${discount.toFixed(2)}`
    });

  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({ message: 'Failed to validate coupon', error: error.message });
  }
};
