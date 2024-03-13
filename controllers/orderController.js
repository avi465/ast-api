const Order = require('../models/Order');

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { userId, products } = req.body;

        // Create a new order
        const order = await Order.create({ userId, products });

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get an order by ID
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find the order by ID
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update an order by ID
const updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Find the order by ID and update the status
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Cancel an order by ID
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find the order by ID and update the status to "Cancelled"
        const cancelledOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: 'Cancelled' },
            { new: true }
        );

        if (!cancelledOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(cancelledOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createOrder,
    getOrderById,
    updateOrder,
    cancelOrder
};
