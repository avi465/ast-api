const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    address: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
    },
    phone: String,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Seller = mongoose.model('Seller', SellerSchema);

module.exports = Seller;
