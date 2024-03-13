const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/', orderController.createOrder);

// Get an order by ID
router.get('/:orderId', orderController.getOrderById);

// Update an order by ID
router.put('/:orderId', orderController.updateOrder);

// Cancel an order by ID
router.delete('/:orderId', orderController.cancelOrder);

module.exports = router;
