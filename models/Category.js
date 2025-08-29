// models/Category.js

const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true,},
    slug: {type: String, required: true, unique: true, lowercase: true, trim: true},
    description: {type: String, default: '', trim: true},
    icon: {type: String, default: ''},
    isActive: {type: Boolean, default: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

categorySchema.pre('validate', function (next) {
    if (this.name) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
