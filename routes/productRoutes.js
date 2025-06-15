const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateAdmin, authenticateUser } = require('../middlewares/authMiddleware');


// Get all products
router.get('/', productController.getAllProducts);

// Get recommended products
// this /endpoint pattern routes should be declared before dynamic
// route such as /:id, if we declare after dynamic routes mongoose
// gets confused with whether it is dynamic or static 
router.get("/recommended", productController.getRecommendedProducts)

// Get purchased courses by user
router.get('/purchased', authenticateUser, productController.getPurchasedCourses);

// Get all product categories
router.get('/category', productController.getAllProductCategories);

// Get product by ID
router.get('/:id', productController.getProductById);

// Get products by category
router.get('/category/:category', productController.getProductsByCategory);

// Add a new product
router.post('/', authenticateAdmin, productController.addProduct);

// Create a new product category
router.post('/category', authenticateAdmin, productController.createProductCategory);

// Update a product
router.put('/:id', authenticateAdmin, productController.updateProduct);

// Delete a product
router.delete('/:id', authenticateAdmin, productController.deleteProduct);

module.exports = router;
