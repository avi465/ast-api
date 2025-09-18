const express = require('express');
const router = express.Router();
const { authenticateAdmin, authenticateUser } = require('../middlewares/authMiddleware');
const Quiz = require('../models/Quiz');
const quizController = require('../controllers/quizController');

router.get('/lesson/:lessonId', authenticateUser, quizController.getQuizByLessonId);

router.get('/course/:id', authenticateUser, quizController.getQuizByCourseId);

module.exports = router;