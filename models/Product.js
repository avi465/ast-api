const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    description: {
        type: String,
        default: '',
        trim: true,
    },
    details: {
        type: String,
        default: '',
        trim: true,
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    images: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Image',
        },
    ],
    isActive: {
        type: Boolean,
        default: true,
    },
    ratings: {
        total: Number,
        count: Number,
        average: Number,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

productSchema.pre('validate', function (next) {
    if (this.name) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
