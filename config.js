const path = require('path');
const fs = require('fs');

const imageUploadPath = path.join('upload', 'images');
fs.mkdirSync(imageUploadPath, { recursive: true }); // Ensure directory exists

module.exports = {
    imageUploadPath
}