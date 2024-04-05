const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: false },
    slug: { type: String, required: false, unique: false },
    description: { type: String, required: false },
    details: { type: String, required: false },
    price: { type: Number, required: false },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
    attributes: {
        color: String,
        size: String,
        material: String,
    },
    images: [
        {
            url: {
                type: String,
                required: false,
            },
            altText: {
                type: String,
                required: false,
            },
        },
    ],
    reviews: [
        {
            review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
            rating: Number,
        },
    ],
    ratings: {
        total: Number,
        count: Number,
        average: Number,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
