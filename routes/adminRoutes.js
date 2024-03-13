const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const { authenticateAdmin, authorizeAdmin } = require('../middlewares/authMiddleware');

// Admin dashboard home page
router.get('/', authenticateAdmin, adminController.dashboardHome);

// Admin login
router.post('/login', adminController.adminLogin);

// Admin logout
router.post('/logout', authenticateAdmin, adminController.adminLogout);

// Check session
router.get('/verify-session', authenticateAdmin, authController.verifySession);

// Manage sellers
router.get('/sellers', authenticateAdmin, adminController.manageSellers);

// Manage categories
router.get('/categories', authenticateAdmin, adminController.manageCategories);

// Manage brands
router.get('/brands', authenticateAdmin, adminController.manageBrands);

// Manage coupons
router.get('/coupons', authenticateAdmin, adminController.manageCoupons);

// Manage orders
router.get('/orders', authenticateAdmin, adminController.manageOrders);

module.exports = router;
