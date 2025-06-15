const User = require('../models/User');
const Admin = require('../models/Admin');

const authenticateUser = async (req, res, next) => {
    try {
        if (!req.session || !req.session.userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.status(401).json({ error: 'Invalid session' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const authenticateAdmin = async (req, res, next) => {
    try {
        if (!req.session || !req.session.adminId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const admin = await Admin.findById(req.session.adminId);

        if (!admin) {
            return res.status(401).json({ error: 'Invalid session' });
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    authenticateUser,
    authenticateAdmin,
};
