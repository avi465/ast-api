const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { fileUploadPath } = require('../config'); // Add this path in your config

const allowedMimeTypes = ['application/pdf'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, fileUploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const uploadFile = multer({ storage, fileFilter }).single('file');

module.exports = { uploadFile };