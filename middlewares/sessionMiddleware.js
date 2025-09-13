require('dotenv').config();
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const isProduction = process.env.NODE_ENV === 'production';

// Create a new MongoDBStore instance using the existing connection
const store = new MongoDBStore(
    {
        uri: process.env.MONGODB_DATABASE_URL,
        collection: 'sessions',
    },
    function (error) {
        if (error) {
            console.error('Session store error:', error);
        }
    });

// Catch any errors that occur with the session store
store.on('error', (error) => {
    console.error('Session store error:', error);
});

// Configure and use express-session middleware with the session store
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        sameSite: isProduction ? 'lax' : undefined,
        secure: isProduction,
        httpOnly: true,
        path: "/",
        domain: isProduction ? '.advancedstudytutorial.in' : undefined,
        maxAge: 24 * 60 * 60 * 1000 * 30,
    }
});

module.exports = { store, sessionMiddleware };
