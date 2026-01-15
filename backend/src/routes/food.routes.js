const express = require("express");
const foodController = require("../controllers/food.controller");
const { authFoodPartnerMiddleware, authUserMiddleware } = require("../middlewares/auth.middleware");
const multer = require("multer");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage()
});

router.post(
  "/",
  authFoodPartnerMiddleware,
  upload.any(), // Changed back to .any() to handle typos like 'vedio'
  foodController.createFood
);

/*  get /api/food/[protected]  */ 

router.get("/my-food", authFoodPartnerMiddleware, foodController.getMyFood);
router.get("/", foodController.getAllFood);
router.get("/partner/:id", foodController.getPartnerStore);

// Optional auth - works for both logged in and logged out users
router.get("/:id/like-status", (req, res, next) => {
  authUserMiddleware(req, res, (err) => {
    // Continue even if auth fails
    next();
  });
}, foodController.getLikeStatus);

router.get("/:id", foodController.getFoodById);

router.post("/:id/like", authUserMiddleware, foodController.toggleLike);


module.exports = router;
