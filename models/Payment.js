const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    transactionId: String,
    paymentStatus: String,
    paymentMethod: {
        type: String,
        details: {
            cardNumber: String,
            cardHolderName: String,
            expirationDate: String,
            cvv: String,
        },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
