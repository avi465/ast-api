const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        unique: true,
        required: true,
    },
    percentageOff: {
        type: Number,
        required: true,
    },
    validFrom: {
        type: Date,
        required: true,
    },
    validTo: {
        type: Date,
        required: true,
    },
    usageCount: {
        type: Number,
        default: 0,
    },
});

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;
