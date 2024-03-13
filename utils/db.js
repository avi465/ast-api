require('dotenv').config();
const mongoose = require('mongoose');

const databaseUrl = process.env.MONGODB_DATABASE_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(databaseUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
