const express = require('express');
const router = express.Router();
const { authenticateAdmin, authenticateUser } = require('../middlewares/authMiddleware');
const lessonController = require("../controllers/lessonController");

router.get('/course/:courseId', authenticateUser, lessonController.getLessonsByCourseId);

router.get('/', authenticateAdmin, lessonController.getAllLessons);

router.get('/:lessonId', authenticateUser, lessonController.getLessonById);

router.post('/create', authenticateAdmin, lessonController.createLesson);

router.put('/:lessonId', authenticateAdmin, lessonController.updateLesson);

router.delete('/:lessonId', authenticateAdmin, lessonController.deleteLesson);

module.exports = router;