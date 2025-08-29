const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateUser } = require('../middlewares/authMiddleware');

// Payment API Endpoints
// Get Razorpay configuration
router.get('/razorpay/configuration', authenticateUser, paymentController.getRazorpayConfiguration);

// Create a new order
router.post('/razorpay/order', authenticateUser, paymentController.createOrder);

// Verify payment
router.post('/razorpay/verify', authenticateUser, paymentController.verifyPayment);

// Non Razorpay Api Endpoints
// Get payment details by order ID
router.get('/order/:orderId', authenticateUser, paymentController.getPaymentByOrderId);

// Get all payments for a user
router.get('/user', authenticateUser, paymentController.getPaymentsByUserId);

module.exports = router;