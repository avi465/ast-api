const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const { fileUploadPath, s3BucketName } = require('../config');

const allowedMimeTypes = ['application/pdf'];
const isProduction = process.env.NODE_ENV === 'production';

let storage;
if (isProduction) {
    const s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });
    storage = multerS3({
        s3: s3Client,
        bucket: s3BucketName,
        acl: 'public-read',
        key: (req, file, cb) => {
            cb(null, `files/${uuidv4()}${path.extname(file.originalname)}`);
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
    });
} else {
    storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, fileUploadPath),
        filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
    });
}

const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF files are allowed.'), false);
    }
};

const uploadFile = multer({ storage, fileFilter }).single('file');

const handleFileUpload = (req, res, next) => {
    uploadFile(req, res, (error) => {
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ error: `Multer error: ${error.message}` });
        } else if (error) {
            return res.status(400).json({ error: error.message });
        }
        next();
    });
};

module.exports = { handleFileUpload };