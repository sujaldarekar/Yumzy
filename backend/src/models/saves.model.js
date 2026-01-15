const mongoose = require("mongoose");

const saveSchema = new mongoose.Schema(
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

// Prevent duplicate saves
saveSchema.index({ user: 1, food: 1 }, { unique: true });

module.exports = mongoose.model("Save", saveSchema);
