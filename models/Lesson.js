// models/Lesson.js
const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    startTime: { type: Date },
    endTime: { type: Date },
    videoUrl: { type: String },
    type: { type: String, enum: ['live', 'recorded'], required: true },
    status: { type: String,  enum: ['scheduled', 'ongoing', 'completed', 'cancelled', 'pending', 'failed', 'archived'], default: 'scheduled' },
    stream: { type: mongoose.Schema.Types.ObjectId, ref: 'Stream' },
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' },
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// lessonSchema.virtual('slides', {
//     ref: 'Slide',
//     localField: '_id',
//     foreignField: 'lesson',
// });
// lessonSchema.set('toObject', { virtuals: true });
// lessonSchema.set('toJSON', { virtuals: true });

module. exports = mongoose.model('Lesson', lessonSchema);