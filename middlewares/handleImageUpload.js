const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

function getResizeOptions(clientType) {
    // Define the resize options for each client type
    const resizeOptions = {
        mobile: { width: 320, height: 240 },
        // pc: { width: 800, height: 600 },
        // tablet: { width: 600, height: 480 },
    };

    // Return the resize options based on the client type
    return resizeOptions[clientType];
}

// Configure multer middleware for file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            // Specify the destination folder for storing images
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            // const extension = path.extname(file.originalname);
            // const filename = `${uuidv4()}${extension}`;
            const filename = uuidv4();
            cb(null, filename);
        },
    }),
});

// Middleware for handling multiple file uploads
const uploadImages = (req, res, next) => {
    upload.array('images')(req, res, (error) => {
        if (error instanceof multer.MulterError) {
            // A Multer error occurred during file upload
            console.error(error);
            return res.status(400).json({ error: 'File upload error' });
        } else if (error) {
            // An unknown error occurred
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        // Files uploaded successfully
        next();
    });
};

// Middleware for resizing and compressing uploaded images using sharp
const processImages = async (req, res, next) => {
    try {
        const { quality } = req.body;
        const clientTypes = ['mobile', 'pc', 'tablet'];
        const variations = [];

        for (const file of req.files) {
            for (const clientType of clientTypes) {
                const resizeOptions = getResizeOptions(clientType);
                const filename = `${file.filename}_${clientType}.webp`;

                await sharp(file.path)
                    .resize(resizeOptions)
                    .webp({ quality: parseInt(quality) || 80 })
                    .toFile(path.join('uploads', filename));

                // variations.push(filename);
            }
            // Remove the original file
            fs.unlinkSync(file.path);
        }

        req.imageVariations = variations;
        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { uploadImages, processImages };
