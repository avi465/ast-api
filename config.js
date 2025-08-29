const path = require('path');
const fs = require('fs');

const imageUploadPath = path.join('upload', 'images');
fs.mkdirSync(imageUploadPath, { recursive: true }); // Ensure directory exists

const fileUploadPath = path.join('upload', 'files');
fs.mkdirSync(fileUploadPath, { recursive: true }); // Ensure directory exists

const videoUploadPath = path.join('upload', 'videos');
fs.mkdirSync(videoUploadPath, { recursive: true }); // Ensure directory exists

const streamUploadPath = path.join('upload', 'stream');
fs.mkdirSync(streamUploadPath, { recursive: true }); // Ensure directory exists

module.exports = {
    imageUploadPath, fileUploadPath, videoUploadPath, streamUploadPath
}