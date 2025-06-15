const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const { imageUploadPath } = require('../config'); // Adjust the path as necessary

function getResizeOptions(clientType) {
    // Define the resize options for each client type
    const resizeOptions = {
        original: { width: null, height: null }, // Keep original size

        // Square (1:1) - good for profile pictures, thumbnails, grid galleries
        squareXS: { width: 100, height: 100 },
        squareSM: { width: 200, height: 200 },
        squareMD: { width: 400, height: 400 },
        squareLG: { width: 800, height: 800 },

        // Landscape (4:3) - ideal for general photos, galleries
        landscapeXS: { width: 320, height: 240 },
        landscapeSM: { width: 640, height: 480 },
        landscapeMD: { width: 800, height: 600 },
        landscapeLG: { width: 1600, height: 1200 },

        // Widescreen (16:9) - best for videos, banners, wide layout components
        widescreenXS: { width: 320, height: 180 },
        widescreenSM: { width: 640, height: 360 },
        widescreenMD: { width: 1280, height: 720 },
        widescreenLG: { width: 1920, height: 1080 },
        widescreenXL: { width: 3840, height: 2160 }, // 4K

        // Portrait (3:4) - suitable for stories, vertical images
        portraitXS: { width: 180, height: 240 },
        portraitSM: { width: 360, height: 480 },
        portraitMD: { width: 600, height: 800 },
        portraitLG: { width: 900, height: 1200 },

        // Ultra-tall (9:16) - reels, TikTok/Shorts-style content
        tallXS: { width: 180, height: 320 },
        tallSM: { width: 360, height: 640 },
        tallMD: { width: 720, height: 1280 },
        tallLG: { width: 1080, height: 1920 },

        // Panoramic (21:9) - ultra-wide displays or cinematic banners
        panoramaSM: { width: 840, height: 360 },
        panoramaMD: { width: 1680, height: 720 },
        panoramaLG: { width: 2520, height: 1080 },
    };

    // Return the resize options based on the client type
    return resizeOptions[clientType];
}

// Configure multer middleware for file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            // Specify the destination folder for storing images
            cb(null, imageUploadPath);
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
        const clientTypes = ['original', 'landscapeSM', 'portraitSM'];
        const variations = [];

        for (const file of req.files) {
            for (const clientType of clientTypes) {
                const resizeOptions = getResizeOptions(clientType);
                const filename = `${file.filename}_${clientType}.webp`;

                await sharp(file.path)
                    .resize(resizeOptions)
                    .webp({ quality: parseInt(quality) || 80 })
                    .toFile(path.join(imageUploadPath, filename));

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
