require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const { sessionMiddleware } = require('./middlewares/sessionMiddleware');
const { authenticateAdmin, authenticateUser, authenticateUserOrAdmin } = require('./middlewares/authMiddleware');
const {errorResponse, successResponse} = require("./utils/response");
const app = express();

// CORS middleware
app.use(cors({
    // origin: process.env.CORS_ORIGIN, // Replace with frontend's URL
    origin: "http://localhost:3001",
    credentials: true, // Enable cookies and session to be sent in cross-origin requests
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(sessionMiddleware);

// morgan middleware
app.use(morgan('dev'));

// API routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const streamRoutes = require('./routes/streamRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const slideRoutes = require('./routes/slideRoutes');
const profileRoutes = require('./routes/profileRoute');

// Storage bucket
const { imageUploadPath, fileUploadPath} = require('./config');

// hls/dash players
app.use('/player', express.static(path.join(__dirname, 'public')));

app.get('/player/hls', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'hls.html'));
});

app.use('/upload/images', express.static(imageUploadPath));
app.use('/upload/files', authenticateUserOrAdmin, express.static(fileUploadPath));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', courseRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stream', streamRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/lesson', lessonRoutes);
app.use('/api/module', moduleRoutes);
app.use('/api/slide', slideRoutes);
app.use('/api/profile', profileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    errorResponse(res, 'Internal Server Error', 500, [err]);
});

module.exports = app;
