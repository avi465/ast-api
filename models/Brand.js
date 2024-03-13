const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
