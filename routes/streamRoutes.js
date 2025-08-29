const express = require('express');
const router = express.Router();
const { authenticateAdmin, authenticateUser } = require('../middlewares/authMiddleware');
const streamController = require('../controllers/streamController');

router.get('/', authenticateAdmin, streamController.getAllStreams);

router.get('/user', authenticateUser, streamController.getStreamForCurrentUser);

router.get('/:id', authenticateUser, streamController.getStreamById);

router.post('/create', authenticateAdmin, streamController.createStream);

module.exports = router;