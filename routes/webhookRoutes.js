// routes/webhook.js
const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const webhookController = require('../controllers/webhookController');

router.post('/stream-ended', webhookController.streamEndedWebhook);

module.exports = router;