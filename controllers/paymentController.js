const Razorpay = require("razorpay")
const {v4: uuidv4} = require("uuid");
const crypto = require("crypto");

const Product = require("../models/Course");
const User = require('../models/User');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const {errorResponse, successResponse} = require("../utils/response");

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// Get Razorpay configuration
// todo: implememt key encrypton and decryption
exports.getRazorpayConfiguration = async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await User.findById(userId);

        if (!userId) {
            return res.status(401).json({message: "Unauthorized"});
        }

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const response = {
            key_id: process.env.RAZORPAY_KEY_ID,
            name: user.name,
            email: user.email,
            phone: user.phone,
            retry: false // Retry payment on failure
        }

        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
}

exports.createOrder = async (req, res) => {
    try {
        const {courseId} = req.body;
        const userId = req.session.userId;

        // authenticateUser middleware will verify the session
        if (!userId) {
            return res.status(401).json({message: "Unauthorized"});
        }

        // Fetch course details by Id
        const course = await Product.findById(courseId);
        if (!course) {
            return res.status(404).json({message: "Course not found"});
        }

        // Extract price and discount and calculate amount
        const {price, discount} = course;
        const discountedPrice = price - (price * discount) / 100;
        const amount = Math.round(discountedPrice * 100); // Convert to paise

        // Generate a unique receipt Id for the order
        function generateUniqueReceipt() {
            return `${uuidv4()}`; // 36 char
        }

        // Create an order in Razorpay
        const options = {
            amount: amount, // required
            currency: "INR", // required
            receipt: generateUniqueReceipt(), // unique, max: 40 char
        }

        const order = await razorpayInstance.orders.create(options);

        // Create a new order in the database
        const newOrder = new Order({
            user: userId,
            course: courseId,
            receipt: order.receipt,
            orderId: order.id,
        });

        await newOrder.save();

        // Return the Razorpay order details to the client
        res.status(201).json(order);

    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({success: false, message: "Failed to create order"});
    }
}

// Payment success route
exports.verifyPayment = async (req, res) => {
    try {
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({success: false, message: "Invalid payment details"});
        }

        // Check if the payment is already verified
        const existingPayment = await Payment.findOne({razorpayPaymentId: razorpay_payment_id});
        if (existingPayment) {
            return res.status(400).json({success: false, message: "Payment already verified"});
        }

        // Retrieve the order from the database using razorpay_order_id
        // This is to verify razorpay_order_id with the orderId in our database to avoid tampering
        const order = await Order.findOne({orderId: razorpay_order_id});
        if (!order) {
            return res.status(404).json({success: false, message: "Order not found"});
        }

        // Verify the payment signature
        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
        // order_id: Retrieve the order_id from your server. Do not use the razorpay_order_id returned by Checkout.
        hmac.update(order.orderId + "|" + razorpay_payment_id);
        const generatedSignature = hmac.digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({success: false, message: "Payment verification failed"});
        }

        // Payment verification successful, save payment details in the database
        const payment = new Payment({
            razorpayPaymentId: razorpay_payment_id,
            razorpayOrderId: razorpay_order_id,
            razorpaySignature: razorpay_signature,
            order: order._id,
            user: order.user,
        });

        await payment.save();

        await User.findByIdAndUpdate(order.user, {
            $addToSet: {orders: order._id} // Prevents duplicate entries
        });

        res.status(200).json({success: true, message: "Payment verified successfully"});

    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({success: false, message: "Failed to verify payment"});
    }
}

// Get payment details by order ID
exports.getPaymentByOrderId = async (req, res) => {
    const {orderId} = req.params;

    try {
        // Find the payment by order ID
        const payment = await Payment.findOne({razorpayOrderId: orderId})
            .populate('order')
            .populate('user');

        if (!payment) {
            return errorResponse(res, "Payment not found for this order", 404);
        }

        successResponse(res, "Payment details fetched successfully", 200, payment);

    } catch (error) {
        errorResponse(res, "Payment not found for this order", 400, [error.message]);
    }
}

// Get all payments for a user
exports.getPaymentsByUserId = async (req, res) => {
    const userId = req.session.userId;

    try {
        // Find all payments made by the user

        // populate the order details with course information
        if (!userId) {
            return res.status(401).json({success: false, message: "Unauthorized"});
        }
        const user = await User.findById(userId);
        const payments = await Payment.find({user: userId})
            .select('razorpayPaymentId razorpayOrderId order user createdAt updatedAt')
            .populate({
                path: 'order',
                select: 'orderId',
                populate: {
                    path: 'course',
                    select: '-category',
                    populate: {
                        path: 'images',
                        select: 'url altText'
                    }
                }
            });

        if (payments.length === 0) {
            return errorResponse(res, "No transactions found", 404);
        }

        successResponse(res, "Payments fetched successfully", 200, payments);

    } catch (error) {
        errorResponse(res, "Failed to fetch payments", 400, [error.message]);
    }
}
