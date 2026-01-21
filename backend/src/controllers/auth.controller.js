require("dotenv").config();

const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodPartnerModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// ---------------- USER ----------------

async function registerUser(req, res) {
  const { fullName, email, password } = req.body;

  try {
    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.cookie("userToken", token, { httpOnly: true });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, fullName: user.fullName, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.cookie("userToken", token, { httpOnly: true });

    res.json({ message: "User logged in successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

function logoutUser(req, res) {
  res.clearCookie("userToken");
  res.json({ message: "User logged out" });
}

// ---------------- FOOD PARTNER ----------------

async function registerFoodPartner(req, res) {
  // Normalize fields to avoid mismatches from casing/whitespace
  const { name, email, password, contactName, phone } = {
    ...req.body,
    email: req.body.email?.trim().toLowerCase(),
    name: req.body.name?.trim(),
    contactName: req.body.contactName?.trim(),
    phone: req.body.phone?.trim(),
  };

  try {
    const existing = await foodPartnerModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Food partner already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const partner = await foodPartnerModel.create({
      name,
      email,
      password: hashedPassword,
      contactName,
      phone
    });

    const token = jwt.sign({ id: partner._id }, JWT_SECRET);
    res.cookie("partnerToken", token, { httpOnly: true });

    res.status(201).json({
      message: "Food partner registered successfully",
      partner: { id: partner._id, name: partner.name, email: partner.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function loginFoodPartner(req, res) {
  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;

  try {
    const partner = await foodPartnerModel.findOne({ email });
    if (!partner) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, partner.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: partner._id }, JWT_SECRET);
    res.cookie("partnerToken", token, { httpOnly: true });

    res.json({ message: "Food partner logged in successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

function logoutFoodPartner(req, res) {
  res.clearCookie("partnerToken");
  res.json({ message: "Food partner logged out" });
}

async function verifyUser(req, res) {
  try {
    // If middleware passed, user is authenticated
    res.status(200).json({
      authenticated: true,
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email
      }
    });
  } catch (error) {
    res.status(401).json({ authenticated: false, message: "Not authenticated" });
  }
}

async function verifyPartner(req, res) {
  try {
    // If middleware passed, partner is authenticated
    res.status(200).json({
      authenticated: true,
      partner: {
        id: req.foodPartner._id,
        name: req.foodPartner.name,
        email: req.foodPartner.email
      }
    });
  } catch (error) {
    res.status(401).json({ authenticated: false, message: "Not authenticated" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
  verifyUser,
  verifyPartner
};
