const mongoose = require("mongoose");

const foodPartnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contactName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String }
    },
    logo: {
      type: String,
      default: null
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("foodPartner", foodPartnerSchema);
