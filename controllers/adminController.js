const bcrypt = require('bcrypt');
const { store } = require('../middlewares/sessionMiddleware');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Seller = require('../models/Seller');
const Order = require('../models/Order');
// ...

const adminLogin = async (req, res) => {
    const { email, password, rememberMe } = req.body;

    try {
        // Find the user by email
        const adminUser = await Admin.findOne({ email });

        // Check if the user exists
        if (!adminUser) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Validate the password
        const isValidPassword = bcrypt.compareSync(password, adminUser.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Log in the user

        // Set the user ID in the session
        req.session.adminId = adminUser._id;

        // Set the session expiration if rememberMe is true
        if (rememberMe) {
            req.session.cookie.expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        }

        // Send a success response
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const adminLogout = (req, res) => {
    try {
        // Clear the session data
        req.session.destroy();

        // Remove the session from the session store
        store.destroy(req.sessionID, (error) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: 'Error while destroying session' });
            }

            // Clear the session cookie
            res.clearCookie('sessionId');

            // Respond with a success message or redirect to the desired page
            res.status(200).json({ message: 'Logout successful' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const dashboardHome = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find();

        // Fetch all orders from the database
        const orders = await Order.find();

        // Return the users and orders as the API response
        res.json({ users, orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const manageUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find();

        // Return the users as the API response
        res.json({ users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const manageOrders = async (req, res) => {
    try {
        // Fetch all orders from the database
        const orders = await Order.find();

        // Return the orders as the API response
        res.json({ orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const manageSellers = async (req, res) => {
    try {
        // Fetch all sellers from the database
        const sellers = await Seller.find();

        // Return the sellers as the API response
        res.json({ sellers });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const manageCategories = async (req, res) => {
    try {
        // Fetch all categories from the database
        const categories = await Category.find();

        // Return the categories as the API response
        res.json({ categories });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const manageBrands = async (req, res) => {
    try {
        // Fetch all brands from the database
        const brands = await Brand.find();

        // Return the brands as the API response
        res.json({ brands });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const manageCoupons = async (req, res) => {
    try {
        // Fetch all coupons from the database

        // Return the coupons as the API response

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    adminLogin,
    adminLogout,
    dashboardHome,
    manageSellers,
    manageBrands,
    manageCategories,
    manageCoupons,
    manageUsers,
    manageOrders
};
