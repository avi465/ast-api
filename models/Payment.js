const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    razorpayPaymentId: String,
    razorpayOrderId: String,
    razorpaySignature: String,
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
