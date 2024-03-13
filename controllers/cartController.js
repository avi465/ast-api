const Cart = require('../models/Cart');

// Get the cart for a specific user
exports.getCartByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the cart for the specified user
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            // Cart not found
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Add an item to the cart
exports.addToCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId, quantity } = req.body;

        // Find the cart for the specified user
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Cart not found, create a new one
            cart = new Cart({ userId, items: [] });
        }

        // Check if the item already exists in the cart
        const existingItem = cart.items.find(item => item.productId === productId);

        if (existingItem) {
            // Item already exists, update the quantity
            existingItem.quantity += quantity;
        } else {
            // Item does not exist, add it to the cart
            cart.items.push({ productId, quantity });
        }

        // Save the updated cart
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update the quantity of an item in the cart
exports.updateCartItemQuantity = async (req, res) => {
    try {
        const { userId, itemId } = req.params;
        const { quantity } = req.body;

        // Find the cart for the specified user
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            // Cart not found
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the item in the cart
        const item = cart.items.id(itemId);

        if (!item) {
            // Item not found
            return res.status(404).json({ message: 'Item not found in the cart' });
        }

        // Update the item quantity
        item.quantity = quantity;

        // Save the updated cart
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Remove an item from the cart
exports.removeItemFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.params;

        // Find the cart for the specified user
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            // Cart not found
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the item in the cart
        const item = cart.items.id(itemId);

        if (!item) {
            // Item not found
            return res.status(404).json({ message: 'Item not found in the cart' });
        }

        // Remove the item from the cart
        item.remove();

        // Save the updated cart
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
