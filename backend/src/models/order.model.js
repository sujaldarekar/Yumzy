const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    foodItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "food",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true }
    },
    paymentOption: {
      type: String,
      enum: ['COD', 'Card', 'UPI', 'Wallet'],
      required: true,
      default: 'COD'
    },
    couponCode: {
      type: String,
      default: null
    },
    loyaltyPointsUsed: {
      type: Number,
      default: 0,
      min: 0
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    estimatedDeliveryTime: {
      type: Date
    },
    foodPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "foodPartner",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
