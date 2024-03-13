const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { uploadImages, processImages } = require('../middlewares/handleImageUpload');

// Get all products
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Add a new product
router.post('/', uploadImages, processImages, productController.addProduct);

// Update a product
router.put('/:id', productController.updateProduct);

// Delete a product
router.delete('/:id', productController.deleteProduct);

module.exports = router;
