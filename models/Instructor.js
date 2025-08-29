// models/Instructor.js
const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bio: { type: String },
    avatar: { type: String }
});

module.exports = mongoose.model('Instructor', instructorSchema);