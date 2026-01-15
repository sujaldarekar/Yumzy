const express = require("express");
const commentsController = require("../controllers/comments.controller");
const { authUserMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/:foodId", commentsController.getComments);
router.post("/:foodId", authUserMiddleware, commentsController.addComment);

module.exports = router;
