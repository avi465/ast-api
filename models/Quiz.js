// models/Quiz.js
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Quiz', quizSchema);