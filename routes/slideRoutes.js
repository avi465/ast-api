const express = require('express');
const router = express.Router();
const { authenticateAdmin, authenticateUser } = require('../middlewares/authMiddleware');
const slideController = require("../controllers/slideController");

router.get('/lesson/:lessonId', authenticateUser, slideController.getSlidesByLessonId);

router.get('/course/:courseId', authenticateUser, slideController.getSlidesByCourseId);

router.post('/', authenticateAdmin, slideController.createSlide);

module.exports = router;