const mongoose = require('mongoose');
const foodPartnerModel = require('./src/models/foodPartnerModel');
require('dotenv').config();

async function checkPartner() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/food-view");
        console.log("Connected to MongoDB");
        
        const partner = await foodPartnerModel.findOne({ email: "partner@m.com" });
        if (partner) {
            console.log("Partner found:", partner.email);
            console.log("Name:", partner.name);
        } else {
            console.log("Partner NOT found: partner@m.com");
        }
        
        const allPartners = await foodPartnerModel.find({}, 'email name');
        console.log("All partners in DB:", allPartners);
        
        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}

checkPartner();
