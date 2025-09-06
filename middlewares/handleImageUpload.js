const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const { imageUploadPath, s3BucketName } = require('../config');
const {errorResponse, successResponse} = require("../utils/response");

const isProduction = process.env.NODE_ENV === 'production';

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

let storage;
let s3Client;
if (isProduction) {
    s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });
    storage = multerS3({
        s3: s3Client,
        bucket: s3BucketName,
        // acl: 'public-read',
        key: (req, file, cb) => {
            cb(null, `images/${uuidv4()}${path.extname(file.originalname)}`);
        },
    });
} else {
    storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, imageUploadPath),
        filename: (req, file, cb) => cb(null, uuidv4()),
    });
}

const upload = multer({ storage });

const uploadImages = (req, res, next) => {
    upload.array('images')(req, res, (error) => {
        if (error instanceof multer.MulterError) {
            errorResponse(res, "Multer error", 500, [error.message]);
        } else if (error) {
            errorResponse(res, "Internal Server Error", 500, [error.message]);
        }
        next();
    });
};

const processImages = async (req, res, next) => {
    try {
        const { quality } = req.body;
        const clientTypes = ['original', 'landscapeSM', 'portraitSM'];
        const variations = [];

        if (!req.files || req.files.length === 0) return next();

        for (const file of req.files) {
            for (const clientType of clientTypes) {
                const resizeOptions = getResizeOptions(clientType);
                const filename = `${file.filename || uuidv4()}_${clientType}.webp`;

                if (isProduction) {
                    // S3: Download, process, upload
                    const s3Key = file.key || file.location.split('/').pop();
                    const getCmd = new GetObjectCommand({ Bucket: s3BucketName, Key: s3Key });
                    const s3Object = await s3Client.send(getCmd);

                    // s3Object.Body is a stream, convert to buffer
                    const chunks = [];
                    for await (const chunk of s3Object.Body) {
                        chunks.push(chunk);
                    }
                    const buffer = Buffer.concat(chunks);

                    const processedBuffer = await sharp(buffer)
                        .resize(resizeOptions)
                        .webp({ quality: parseInt(quality) || 80 })
                        .toBuffer();

                    const uploadKey = `images/${filename}`;
                    const putCmd = new PutObjectCommand({
                        Bucket: s3BucketName,
                        Key: uploadKey,
                        Body: processedBuffer,
                        ContentType: 'image/webp',
                        // ACL: 'public-read'
                    });
                    await s3Client.send(putCmd);

                    variations.push({ key: uploadKey, url: `https://${s3BucketName}.s3.amazonaws.com/${uploadKey}` });
                } else {
                    // Local: Process and save
                    const outputPath = path.join(imageUploadPath, filename);
                    await sharp(file.path)
                        .resize(resizeOptions)
                        .webp({ quality: parseInt(quality) || 80 })
                        .toFile(outputPath);

                    variations.push({ filename, path: outputPath });
                }
            }
            if (!isProduction && file.path) fs.unlinkSync(file.path);
        }

        req.imageVariations = variations;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { uploadImages, processImages };
