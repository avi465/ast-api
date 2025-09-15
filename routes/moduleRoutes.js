const express = require('express');
const router = express.Router();
const { authenticateAdmin, authenticateUser } = require('../middlewares/authMiddleware');
const moduleController = require('../controllers/moduleController');

router.post('/create', authenticateAdmin, moduleController.createModule);

router.get('/', authenticateUser, moduleController.getModules);

router.get('/:moduleId', authenticateUser, moduleController.getModuleById);

router.get('/course/:courseId', moduleController.getModulesByCourseId);

module.exports = router;