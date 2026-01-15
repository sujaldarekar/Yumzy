const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authUserMiddleware, authFoodPartnerMiddleware } = require('../middlewares/auth.middleware');

// Create a new order
router.post('/', authUserMiddleware, orderController.createOrder);

// Get order by ID
router.get('/:orderId', authUserMiddleware, orderController.getOrderById);

// Get all orders for logged-in user
router.get('/user/all', authUserMiddleware, orderController.getUserOrders);

// Get all orders for logged-in food partner
router.get('/partner/all', authFoodPartnerMiddleware, orderController.getPartnerOrders);

// Update order status (Partner only)
router.patch('/:orderId/status', authFoodPartnerMiddleware, orderController.updateOrderStatus);

// Confirm order receipt (User only)
router.patch('/:orderId/confirm-receipt', authUserMiddleware, orderController.confirmOrderReceipt);

// Validate coupon code
router.post('/validate-coupon', authUserMiddleware, orderController.validateCoupon);

module.exports = router;
