const express = require('express');
const router = express.Router();
const { uploadImages, processImages } = require('../middlewares/handleImageUpload');
const uploadController = require('../controllers/uploadController');
const { authenticateAdmin, authenticateUser } = require('../middlewares/authMiddleware');

// Upload product images
router.post('/images', authenticateAdmin, uploadImages, processImages, uploadController.uploadImages);

module.exports = router;