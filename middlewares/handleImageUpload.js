const multer = require('multer');
const {v4: uuidv4} = require('uuid');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const {S3Client, GetObjectCommand, PutObjectCommand} = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const {imageUploadPath, s3BucketName} = require('../config');
const {errorResponse, successResponse} = require("../utils/response");

const isProduction = process.env.NODE_ENV === 'production';
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function getResizeDimensions() {
    return [
        {width: null, height: null}, // original
        {width: 200, height: 200},   // square small
        {width: 640, height: 480},   // 4:3 small
        {width: 1280, height: 720},  // 16:9 medium
        {width: 1920, height: 1080}, // 16:9 full HD
    ];
}

let s3Client;
let storage;

if (isProduction) {
    s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });

    storage = multer.memoryStorage();
} else {
    storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, imageUploadPath),
        filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname)),
    });
}

const upload = multer(
    {
        storage,
        limits: {
            fileSize: MAX_FILE_SIZE
        },
    });

const uploadImages = upload.array('images');

const processImages = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) return next();

        const {quality = "100", altText = ""} = req.body;
        const processedImages  = [];
        sharp.cache(false);

        for (const file of req.files) {
            const uuid = uuidv4();
            const variants = [];

            for (const {width, height} of getResizeDimensions()) {
                const filename = `${uuid}_${width || "auto"}x${height || "auto"}.webp`;
                let url, size, meta;

                if (isProduction) {
                    const buffer = await sharp(file.buffer)
                        .resize(width, height)
                        .webp({ quality: parseInt(quality) })
                        .toBuffer();

                    const key = `images/${uuid}/${filename}`;
                    await s3Client.send(
                        new PutObjectCommand({
                            Bucket: s3BucketName,
                            Key: key,
                            Body: buffer,
                            ContentType: "image/webp",
                        })
                    );

                    meta = await sharp(buffer).metadata();
                    size = buffer.length;
                    url = `https://${s3BucketName}.s3.amazonaws.com/${key}`;

                } else {
                    const outputPath = path.join(imageUploadPath, filename);
                    await sharp(file.path)
                        .resize(width, height)
                        .webp({quality: parseInt(quality)})
                        .toFile(outputPath);

                    meta = await sharp(outputPath).metadata();
                    size = fs.statSync(outputPath).size;
                    url = `/uploads/${filename}`;
                }

                variants.push({
                    type: `${width || "auto"}x${height || "auto"}`,
                    url,
                    width: meta.width,
                    height: meta.height,
                    size,
                });
            }

            if (!isProduction && file.path) {
                fs.unlink(file.path, (err) => {
                    if (err) console.error("Failed to remove temp file:", file.path, err);
                });
            }

            processedImages.push({
                storageType: isProduction ? "s3" : "local",
                altText,
                variants,
                metadata: {
                    fieldname: file.fieldname,
                    originalname: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size,
                    ...(isProduction
                        ? { bucket: s3BucketName }
                        : {
                            destination: file.destination,
                            filename: file.filename,
                            path: file.path,
                        }),
                },
            });
        }
        req.processedImages = processedImages;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = {uploadImages, processImages};
