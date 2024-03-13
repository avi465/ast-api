const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const authCotroller = require('../controllers/authController');
const { authenticateSeller, authorizeSeller } = require('../middlewares/authMiddleware');

// Protect the routes with authentication and authorization middleware
// router.use(authenticateSeller);

// User registration
router.post('/register', sellerController.sellerRegister);

// User login
router.post('/login', sellerController.sellerLogin);

// User logout
router.post('/logout', authenticateSeller, sellerController.sellerLogout);

// Check session
router.get('/verify-session', authenticateSeller, authCotroller.verifySession);

// Add a new product
router.post('/products', authorizeSeller, sellerController.addProduct);

// Edit an existing product
router.put('/products/:productId', authorizeSeller, sellerController.editProduct);

// Delete a product
router.delete('/products/:productId', authorizeSeller, sellerController.deleteProduct);


module.exports = router;
