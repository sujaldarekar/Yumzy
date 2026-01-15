const express = require("express");
const savesController = require("../controllers/saves.controller");
const { authUserMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authUserMiddleware, savesController.getSavedVideos);
router.post("/:foodId", authUserMiddleware, savesController.toggleSave);

module.exports = router;
