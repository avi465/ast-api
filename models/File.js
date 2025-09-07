const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalname: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
    storageType: { type: String, enum: ['local', 's3'], default: 'local' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    uploadDate: { type: Date, default: Date.now },
    metadata: { type: Object },
    description: { type: String },
    tags: [{ type: String }]
});

module.exports = mongoose.model('File', fileSchema);