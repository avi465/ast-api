const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateUser } = require('../middlewares/authMiddleware');


// register user
router.post('/register', authController.register);

// login user
router.post('/login', authController.login);

// logout user
router.post('/logout', authenticateUser, authController.logout);

// get otp
router.post('/get-otp', authController.getOtp);

// verify otp
router.post('/verify-otp', authController.verifyOtp);

// verify session
router.get('/verify-session', authenticateUser, authController.verifySession);

// reset password
// router.post('/reset-password', authController.resetPassword);

module.exports = router;
