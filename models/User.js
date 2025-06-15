const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
    orders: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    ],
    address: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        postalCode: String,
        country: { type: String, default: 'India' },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
