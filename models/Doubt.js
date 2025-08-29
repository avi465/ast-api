// models/Doubt.js
const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
    question: { type: String, required: true },
    askedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    status: { type: String, enum: ['open', 'resolved', 'closed'], default: 'open' },
    answer: { type: String },
    answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Doubt', doubtSchema);