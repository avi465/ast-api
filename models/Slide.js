// models/Slide.js
const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
    title: { type: String, trim: true },
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    file: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Slide', slideSchema);