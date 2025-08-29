const express = require('express');
const router = express.Router();
const { authenticateAdmin, authenticateUser } = require('../middlewares/authMiddleware');
const profileController = require("../controllers/profileController");

router.get('/user', authenticateUser, profileController.getUserProfile);

router.get('/admin', authenticateAdmin, profileController.getAdminProfile);

router.put('/user', authenticateUser, profileController.updateUserProfile);

router.put('/admin', authenticateAdmin, profileController.updateAdminProfile);

module.exports = router;