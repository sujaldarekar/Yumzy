const express = require("express");
const authController = require("../controllers/auth.controller");
const { authUserMiddleware, authFoodPartnerMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

// Simple health check
router.get("/health", (req, res) => {
  res.json({ message: "Auth service is healthy" });
});

// Verification endpoints
router.get("/verify", authUserMiddleware, authController.verifyUser);
router.get("/verify-partner", authFoodPartnerMiddleware, authController.verifyPartner);

// User routes
router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.post("/user/logout", authController.logoutUser);
router.get("/user/logout", authController.logoutUser);

// Food partner routes
router.post("/food-partner/register", authController.registerFoodPartner);
router.post("/food-partner/login", authController.loginFoodPartner);
router.post("/food-partner/logout", authController.logoutFoodPartner);
router.get("/food-partner/logout", authController.logoutFoodPartner);

module.exports = router;
