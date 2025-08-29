const express = require('express');
const router = express.Router();
const { authenticateAdmin, authenticateUser } = require('../middlewares/authMiddleware');
const moduleController = require('../controllers/moduleController');

router.post('/create', authenticateAdmin, moduleController.createModule);

module.exports = router;