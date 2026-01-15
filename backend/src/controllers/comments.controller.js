const commentModel = require("../models/comments.model");

async function getComments(req, res) {
  try {
    const { foodId } = req.params;
    
    const comments = await commentModel
      .find({ food: foodId })
      .populate("user", "fullName")
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function addComment(req, res) {
  try {
    const { foodId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const comment = await commentModel.create({
      user: userId,
      food: foodId,
      text: text.trim()
    });

    // Populate user info before sending back
    await comment.populate("user", "fullName");

    res.status(201).json({ 
      message: "Comment added",
      comment 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getComments, addComment };
