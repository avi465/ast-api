const express = require('express');
const router = express.Router();
const { uploadImages, processImages } = require('../middlewares/handleImageUpload');
const uploadController = require('../controllers/uploadController');
const { authenticateAdmin, authenticateUser } = require('../middlewares/authMiddleware');
const {uploadFile} = require("../middlewares/handleFileUpload");

// Upload product images
router.post('/images', authenticateAdmin, uploadImages, processImages, uploadController.uploadImages);

// Upload files (e.g., PDFs)
router.post('/files', authenticateAdmin, uploadFile, uploadController.uploadFile);

module.exports = router;