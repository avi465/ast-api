// models/Stream.js
const mongoose = require('mongoose');

const streamSchema = new mongoose.Schema({
    streamKey: { type: String, required: true, unique: true },
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Stream', streamSchema);