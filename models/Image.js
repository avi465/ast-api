const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url: {type: String, required: true},
    altText: {type: String, default: '', trim: true},
    metadata: {
        fieldname: String, // e.g., "images"
        originalname: String, // e.g., "image.jpg"
        encoding: String, // e.g., "7bit"
        mimetype: String, // e.g., "image/jpeg"
        destination: String, // e.g., "/uploads/images"
        filename: String, // e.g., "1234567890abcdef.jpg"
        path: String, // e.g., "/uploads/images/1234567890abcdef.jpg"
        size: Number, // in bytes
        width: Number,
        height: Number,
    },
    createdAt: {type: Date, default: Date.now},
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
