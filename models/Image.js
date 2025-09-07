const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    storageType: { type: String, enum: ['local', 's3'], default: 'local' },
    altText: {type: String, default: '', trim: true},
    variants: [
        {
            _id: false,
            type: {type: String, required: true},
            url: { type: String, required: true },
            width: Number,
            height: Number,
            size: Number,
        }
    ],
    metadata: {
        // Common fields
        fieldname: String,
        originalname: String,
        encoding: String,
        mimetype: String,
        size: Number,
        // S3-specific
        bucket: String,
        key: String,
        acl: String,
        contentType: String,
        contentDisposition: String,
        contentEncoding: String,
        storageCLass: String,
        serverSideEncryption: String,
        metadata: Object,
        location: String,
        etag: String,
        versionId: String,
        // Local-specific
        destination: String,
        filename: String,
        path: String,
    },
    createdAt: {type: Date, default: Date.now},
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
