const mongoose = require("mongoose");

const loyaltyPointsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true
    },
    points: {
      type: Number,
      default: 0,
      min: 0
    },
    earnedFromOrders: [{
      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order"
      },
      pointsEarned: {
        type: Number,
        min: 0
      },
      earnedAt: {
        type: Date,
        default: Date.now
      }
    }],
    redemptionHistory: [{
      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order"
      },
      pointsUsed: {
        type: Number,
        min: 0
      },
      redeemedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("loyaltyPoints", loyaltyPointsSchema);
