require('dotenv').config();
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

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
        secure: process.env.NODE_ENV === 'production',  // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 * 30, // Session expiration time in milliseconds
    },
});

module.exports = { store, sessionMiddleware };
