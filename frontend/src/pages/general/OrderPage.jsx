import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import '../../styles/Order.css';

function OrderPage() {
  const { foodId } = useParams();
  const navigate = useNavigate();
  
  const [foodItem, setFoodItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const [paymentOption, setPaymentOption] = useState('COD');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [loyaltyPointsToUse, setLoyaltyPointsToUse] = useState(0);
  const [orderMessage, setOrderMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchFoodItem = useCallback(async () => {
    try {
      const response = await api.get(`/api/food/${foodId}`);
      setFoodItem(response.data.foodItem);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching food item:', error);
      setOrderMessage('Failed to load food item');
      setLoading(false);
    }
  }, [foodId]);

  const fetchUserLoyaltyPoints = useCallback(async () => {
    try {
      const response = await api.get('/api/auth/verify');
      setLoyaltyPoints(response.data.user.loyaltyPoints || 0);
    } catch (error) {
      console.error('Error fetching loyalty points:', error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const initData = async () => {
      if (!isMounted) return;
      await fetchFoodItem();
      if (!isMounted) return;
      await fetchUserLoyaltyPoints();
    };

    initData();

    return () => {
      isMounted = false;
    };
  }, [fetchFoodItem, fetchUserLoyaltyPoints]);

  const handleQuantityChange = (increment) => {
    setQuantity(prev => {
      const newQty = prev + increment;
      return Math.max(1, Math.min(10, newQty));
    });
  };

  const handleAddressChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setOrderMessage('Please enter a coupon code');
      setTimeout(() => setOrderMessage(''), 3000);
      return;
    }

    try {
      const baseAmount = foodItem.price * quantity;
      const response = await api.post('/api/orders/validate-coupon', {
        couponCode,
        amount: baseAmount
      });

      setCouponApplied(true);
      setCouponDiscount(response.data.discount);
      setOrderMessage(response.data.message);
      setTimeout(() => setOrderMessage(''), 3000);
    } catch (error) {
      setOrderMessage(error.response?.data?.message || 'Invalid coupon code');
      setCouponApplied(false);
      setCouponDiscount(0);
      setTimeout(() => setOrderMessage(''), 3000);
    }
  };

  const handleLoyaltyPointsToggle = () => {
    if (!useLoyaltyPoints) {
      // Calculate max points user can use (up to their balance)
      const maxPoints = loyaltyPoints;
      setLoyaltyPointsToUse(maxPoints);
    } else {
      setLoyaltyPointsToUse(0);
    }
    setUseLoyaltyPoints(!useLoyaltyPoints);
  };

  const calculateTotal = () => {
    if (!foodItem) return { baseAmount: 0, discount: 0, total: 0 };
    
    const baseAmount = foodItem.price * quantity;
    const loyaltyDiscount = useLoyaltyPoints ? loyaltyPointsToUse * 0.1 : 0;
    const totalDiscount = couponDiscount + loyaltyDiscount;
    const total = Math.max(0, baseAmount - totalDiscount);
    
    return { baseAmount, discount: totalDiscount, total };
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!address.street || !address.city || !address.state || !address.pincode || !address.phone) {
      setOrderMessage('Please fill in all address fields');
      setTimeout(() => setOrderMessage(''), 3000);
      return;
    }

    setSubmitting(true);
    
    try {
      const orderData = {
        foodId,
        quantity,
        address,
        paymentOption,
        couponCode: couponApplied ? couponCode : null,
        loyaltyPointsUsed: useLoyaltyPoints ? loyaltyPointsToUse : 0
      };

      const response = await api.post('/api/orders', orderData);

      setOrderMessage('Order placed successfully! 🎉');
      setTimeout(() => {
        navigate(`/order-tracking/${response.data.order._id}`);
      }, 1500);

    } catch (error) {
      console.error('Error placing order:', error);
      setOrderMessage(error.response?.data?.message || 'Failed to place order');
      setSubmitting(false);
      setTimeout(() => setOrderMessage(''), 3000);
    }
  };

  if (loading) {
    return <div className="order-loading">Loading order details...</div>;
  }

  if (!foodItem) {
    return <div className="order-error">Food item not found</div>;
  }

  const { baseAmount, discount, total } = calculateTotal();

  return (
    <div className="order-page">
      <div className="order-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <img src="/logo/yumzy.png" alt="Yumzy" className="order-logo" />
        <h1 className="order-title">Place Your Order</h1>

        {orderMessage && <div className="order-message">{orderMessage}</div>}

        <div className="order-content">
          {/* Food Item Info */}
          <div className="food-info">
            <video src={foodItem.video} className="food-video" muted loop autoPlay />
            <h2>{foodItem.name}</h2>
            <p className="food-description">{foodItem.description}</p>
            <p className="food-price">₹{foodItem.price} per item</p>
          </div>

          {/* Order Form */}
          <form className="order-form" onSubmit={handlePlaceOrder}>
            {/* Quantity Selector */}
            <div className="form-section">
              <label>Quantity</label>
              <div className="quantity-selector">
                <button type="button" onClick={() => handleQuantityChange(-1)}>-</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => handleQuantityChange(1)}>+</button>
              </div>
            </div>

            {/* Address Form */}
            <div className="form-section">
              <label>Delivery Address</label>
              <input 
                type="text" 
                placeholder="Street Address" 
                value={address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                required
              />
              <div className="address-row">
                <input 
                  type="text" 
                  placeholder="City" 
                  value={address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  required
                />
                <input 
                  type="text" 
                  placeholder="State" 
                  value={address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  required
                />
              </div>
              <div className="address-row">
                <input 
                  type="text" 
                  placeholder="Pincode" 
                  value={address.pincode}
                  onChange={(e) => handleAddressChange('pincode', e.target.value)}
                  required
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  value={address.phone}
                  onChange={(e) => handleAddressChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Payment Options */}
            <div className="form-section">
              <label>Payment Option</label>
              <div className="payment-options">
                {['COD', 'Card', 'UPI', 'Wallet'].map(option => (
                  <button
                    key={option}
                    type="button"
                    className={`payment-option ${paymentOption === option ? 'active' : ''}`}
                    onClick={() => setPaymentOption(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Coupon Code */}
            <div className="form-section">
              <label>Coupon Code (Try: FIRST10, SAVE50, WELCOME20)</label>
              <div className="coupon-input">
                <input 
                  type="text" 
                  placeholder="Enter coupon code" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={couponApplied}
                />
                <button 
                  type="button" 
                  onClick={applyCoupon}
                  disabled={couponApplied}
                  className="apply-coupon-btn"
                >
                  {couponApplied ? '✓ Applied' : 'Apply'}
                </button>
              </div>
            </div>

            {/* Loyalty Points */}
            <div className="form-section">
              <div className="loyalty-points">
                <label>
                  <input 
                    type="checkbox" 
                    checked={useLoyaltyPoints}
                    onChange={handleLoyaltyPointsToggle}
                    disabled={loyaltyPoints === 0}
                  />
                  Use Loyalty Points ({loyaltyPoints} available)
                </label>
                {useLoyaltyPoints && (
                  <p className="loyalty-info">
                    Using {loyaltyPointsToUse} points = ₹{(loyaltyPointsToUse * 0.1).toFixed(2)} discount
                  </p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal ({quantity} items)</span>
                <span>₹{baseAmount.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button 
              type="submit" 
              className="place-order-btn"
              disabled={submitting}
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
