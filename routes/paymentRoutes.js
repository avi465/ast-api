const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateUser } = require('../middlewares/authMiddleware');

// Get Razorpay configuration
router.get('/razorpay/configuration', authenticateUser, paymentController.getRazorpayConfiguration);

// Create a new order
router.post('/razorpay/order', authenticateUser, paymentController.createOrder);

// Verify payment
router.post('/razorpay/verify', authenticateUser, paymentController.verifyPayment);

module.exports = router;