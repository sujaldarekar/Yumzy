const saveModel = require("../models/saves.model");
const foodModel = require("../models/food.model");

async function toggleSave(req, res) {
  try {
    const { foodId } = req.params;
    const userId = req.user._id;

    const existingSave = await saveModel.findOne({ food: foodId, user: userId });

    if (existingSave) {
      await saveModel.findByIdAndDelete(existingSave._id);
      return res.status(200).json({ message: "Unsaved", saved: false });
    } else {
      await saveModel.create({ food: foodId, user: userId });
      return res.status(201).json({ message: "Saved", saved: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getSavedVideos(req, res) {
  try {
    const userId = req.user._id;

    const saves = await saveModel
      .find({ user: userId })
      .populate({
        path: "food",
        populate: { path: "foodPartner" }
      })
      .sort({ createdAt: -1 });

    const foodItems = saves.map(save => save.food).filter(food => food !== null);

    res.status(200).json({ foodItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = { toggleSave, getSavedVideos };
