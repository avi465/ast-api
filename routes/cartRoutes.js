const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Get the cart for a specific user
router.get('/:userId', cartController.getCartByUserId);

// Add an item to the cart
router.post('/:userId', cartController.addToCart);

// Update the quantity of an item in the cart
router.put('/:userId/:itemId', cartController.updateCartItemQuantity);

// Remove an item from the cart
router.delete('/:userId/:itemId', cartController.removeItemFromCart);

module.exports = router;
