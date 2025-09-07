const Image = require('../models/Image');
const File = require('../models/File');
const {errorResponse, successResponse} = require("../utils/response");

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const isProduction = process.env.NODE_ENV === 'production'

exports.uploadImages = async (req, res) => {
    try {
        const files = req.files || [];

        if (!files.length) {
            errorResponse(res, 'No images uploaded', 400, ['No files found in the request']);
        }

        const images = await Image.insertMany(req.processedImages);

        successResponse(res, 'Images uploaded successfully', 201, images.map(({ _id, variants, altText }) => ({
            _id,
            url: variants[0].url,
            altText,
            variants,
        })),)
    } catch (err) {
        errorResponse(res, 'Image upload failed', 500, [err.message]);
    }
};

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // File size validation
        if (req.file.size > MAX_FILE_SIZE) {
            return res.status(400).json({ error: 'File size exceeds limit' });
        }

        const fileDoc = new File({
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: isProduction ? s3Url : req.file.path,
            storageType: isProduction ? 's3' : 'local',
            uploadedBy: req.admin ? req.admin._id : null,
            metadata: {
                fieldname: req.file.fieldname,
                encoding: req.file.encoding,
                destination: req.file.destination
            },
            description: req.body.description || '',
            tags: req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : []
        });

        await fileDoc.save();

        res.status(201).json({
            message: 'File uploaded successfully',
            file: {
                _id: fileDoc._id,
                filename: fileDoc.filename,
                originalname: fileDoc.originalname,
                mimetype: fileDoc.mimetype,
                size: fileDoc.size,
                uploadDate: fileDoc.uploadDate,
                description: fileDoc.description,
                tags: fileDoc.tags
            }
        });
    } catch (err) {
        console.error(err);
        errorResponse(res, 'File upload failed', 500, [err.message]);
    }
};