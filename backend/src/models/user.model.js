const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {           // ✅ fixed typo
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
