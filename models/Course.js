const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    slug: {type: String, required: true, unique: true, lowercase: true, trim: true},
    description: {type: String, default: '', trim: true},
    details: {type: String, default: '', trim: true},
    price: {type: Number, required: true},
    discount: {type: Number, default: 0, min: 0, max: 100},
    language: {type: String, enum: ['english', 'hindi'], default: 'hindi', required: true},
    isActive: {type: Boolean, default: true},
    status: {type: String, enum: ['draft', 'scheduled', 'ongoing', 'completed', 'cancelled', 'archived'], default: 'draft'},
    images: [{type: mongoose.Schema.Types.ObjectId, ref: 'Image'}],
    ratings: {total: Number, count: Number, average: Number},
    instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

courseSchema.pre('validate', function (next) {
    if (this.name) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
