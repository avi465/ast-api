const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticateAdmin, authenticateUser } = require('../middlewares/authMiddleware');


// Get all courses
router.get('/', courseController.getAllCourses);

// Get recommended products
// this /endpoint pattern routes should be declared before dynamic
// route such as /:id, if we declare after dynamic routes mongoose
// gets confused with whether it is dynamic or static 
router.get("/recommended", courseController.getLatestCourses)

// Get purchased courses by user
router.get('/purchased', authenticateUser, courseController.getPurchasedCourses);

// Get all product categories
router.get('/category', courseController.getAllCourseCategories);

// Get product by ID
router.get('/:id', courseController.getCourseById);

// Get products by category
router.get('/category/:category', courseController.getCoursesByCategory);

// Add a new product
router.post('/', authenticateAdmin, courseController.addCourse);

// Create a new product category
router.post('/category', authenticateAdmin, courseController.createCourseCategory);

// Update a product
router.put('/:id', authenticateAdmin, courseController.updateCourse);

// Delete a product
router.delete('/:id', authenticateAdmin, courseController.deleteCourse);

module.exports = router;
