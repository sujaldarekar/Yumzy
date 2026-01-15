const foodModel = require("../models/food.model");
const foodPartnerModel = require("../models/foodPartnerModel");
const likeModel = require("../models/likes.model");
const storageService = require("../services/storage.service");
const { v4: uuidv4 } = require("uuid");

async function createFood(req, res) {
  try {
    // Handle both req.file (single) and req.files (any)
    // Handle cases where the field name might be 'video', 'vedio' or others
    const file = req.file || (req.files && req.files.find(f => f.fieldname === 'video' || f.fieldname === 'vedio' || f.fieldname === 'videoFile')) || (req.files && req.files[0]);

    if (!file) {
      return res.status(400).json({ message: "Video file is required" });
    }

    const base64File = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const originalName = file.originalname;

    const uploadResult = await storageService.uploadFile(
      base64File,
      `${uuidv4()}-${originalName}`
    );

    const food = await foodModel.create({
      name: req.body.name,
      video: uploadResult.url,
      description: req.body.description,
      price: req.body.price,
      foodPartner: req.foodPartner._id
    });

    res.status(201).json({
      message: "Food created successfully",
      food
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getAllFood(req, res) {
  try {
    const foodItems = await foodModel.find().sort({ createdAt: -1 }).populate("foodPartner");
    res.status(200).json({ foodItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getPartnerStore(req, res) {
  try {
    const partnerId = req.params.id;
    const partner = await foodPartnerModel.findById(partnerId).select("-password");
    if (!partner) return res.status(404).json({ message: "Store not found" });

    const foodItems = await foodModel.find({ foodPartner: partnerId }).sort({ createdAt: -1 });
    res.json({ partner, foodItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getLikeStatus(req, res) {
  try {
    const { id } = req.params; // Food ID
    const userId = req.user?._id;

    if (!userId) {
      // User not logged in
      const likeCount = await likeModel.countDocuments({ food: id });
      return res.status(200).json({ liked: false, count: likeCount });
    }

    const existingLike = await likeModel.findOne({ food: id, user: userId });
    const likeCount = await likeModel.countDocuments({ food: id });

    res.status(200).json({
      liked: !!existingLike,
      count: likeCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function toggleLike(req, res) {
  try {
    const { id } = req.params; // Food ID
    const userId = req.user._id;

    const existingLike = await likeModel.findOne({ food: id, user: userId });

    if (existingLike) {
      // Unlike
      await likeModel.findByIdAndDelete(existingLike._id);
      const likeCount = await likeModel.countDocuments({ food: id });
      return res.status(200).json({ message: "Unliked", liked: false, count: likeCount });
    } else {
      // Like
      await likeModel.create({ food: id, user: userId });
      const likeCount = await likeModel.countDocuments({ food: id });
      return res.status(201).json({ message: "Liked", liked: true, count: likeCount });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getFoodById(req, res) {
  try {
    const { id } = req.params;
    const foodItem = await foodModel.findById(id).populate("foodPartner");
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }
    res.status(200).json({ foodItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getMyFood(req, res) {
  try {
    const partnerId = req.foodPartner._id;
    const foodItems = await foodModel.find({ foodPartner: partnerId }).sort({ createdAt: -1 });
    res.status(200).json({ foodItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = { createFood, getAllFood, getPartnerStore, getLikeStatus, toggleLike, getFoodById, getMyFood };
