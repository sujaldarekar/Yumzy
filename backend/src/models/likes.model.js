const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "food",
      required: true
    }
  },
  { timestamps: true }
);

// Prevent duplicate likes from the same user on the same food item
likeSchema.index({ user: 1, food: 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);
