const Image = require('../models/Image');
const File = require('../models/File');
const {errorResponse, successResponse} = require("../utils/response");

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

exports.uploadImages = async (req, res) => {
    try {
        const files = req.files || [];

        if (!files.length) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        console.log(files);

        const images = await Promise.all(
            files.map(async (file) => {
                const image = new Image({
                    url: file.path, // or cloudinary URL
                    altText: file.originalname,
                    metadata: {
                        fieldname: file.fieldname,
                        originalname: file.originalname,
                        encoding: file.encoding,
                        mimetype: file.mimetype,
                        destination: file.destination,
                        filename: file.filename,
                        path: file.path,
                        size: file.size,
                    },
                });
                return await image.save();
            })
        );

        res.status(201).json({
            message: 'Images uploaded successfully',
            images: images.map(({ _id, url, altText }) => ({ _id, url, altText })),
        });
    } catch (err) {
        console.error(err);
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
            path: req.file.path,
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