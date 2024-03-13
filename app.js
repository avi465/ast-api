require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sessionMiddleware } = require('./middlewares/sessionMiddleware');
const app = express();

// CORS middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Replace with frontend's URL
    credentials: true, // Enable cookies and session to be sent in cross-origin requests
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

// Session middleware
app.use(sessionMiddleware);

// morgan middleware
app.use(morgan('dev'));

// API routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
