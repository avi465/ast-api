require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sessionMiddleware } = require('./middlewares/sessionMiddleware');
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
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { imageUploadPath } = require('./config');

// Storage bucket
app.use('/upload/images', express.static(imageUploadPath));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
