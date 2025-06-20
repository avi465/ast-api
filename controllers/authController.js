require('dotenv').config();
const bcrypt = require('bcrypt');
const { store } = require('../middlewares/sessionMiddleware');
const User = require('../models/User');
const { errorResponse, successResponse } = require('../utils/response');

// const { register } = require('../utils/auth');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;
const client = require("twilio")(accountSid, authToken);

// refactor needed

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the email already exists
        if (email) {
            const existingEmailUser = await User.findOne({ email });
            if (existingEmailUser) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            // Check if the password is provided
            if (!password) {
                return res.status(400).json({ error: 'Password is required' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
            });
            await newUser.save();

            res.json({ message: 'User registered successfully' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.login = async (req, res) => {
    const { email, password, rememberMe } = req.body;

    try {
        if (!email || !password) {
            return errorResponse(res, 'Email and password are required', 400, []);
        }

        // Check if the email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return errorResponse(res, 'Invalid email format', 400, []);
        }

        // Check if the password is valid
        // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 characters, at least one letter and one number
        // if (!passwordRegex.test(password)) {
        //     return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least one letter and one number' });
        // }

        // Find the user by email
        const user = await User.findOne({ email });

        // Check if the user exists
        if (!user) {
            return errorResponse(res, "Email not registered", 401, []);
        }

        // Validate the password
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            return errorResponse(res, "Password is incorrect", 401, []);
        }

        // Set the user ID in the session
        req.session.userId = user._id;

        if (rememberMe) {
            req.session.cookie.expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        }
        successResponse(res, 'Login successful', 200, {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            }
        });

    } catch (error) {
        console.log(error);
        errorResponse(res, 'Internal Server Error', 500, [error]);
    }
};

// Get otp
exports.getOtp = async (req, res) => {
    const { phone } = req.body;
    client.verify.v2
        .services(verifySid)
        .verifications.create({ to: phone, channel: "sms" })
        .then((verification) => {
            res.status(200).json({ message: "OTP sent successfully" });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: "Failed to generate OTP" });
        });
}

exports.verifyOtp = async (req, res) => {
    const { phone, otp } = req.body;
    client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: phone, code: otp })
        .then(async (verification_check) => {
            if (verification_check.status === "approved") {

                // Check if the phone number exists
                let user = await User.findOne({ phone });

                if (!user) {
                    // Create a new user
                    const newUser = new User({
                        phone
                    });
                    user = await newUser.save();
                }

                // Set the user ID in the session
                req.session.userId = user._id;
                req.session.cookie.expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

                res.status(200).json({ message: "OTP verified successfully" });
            } else {
                res.status(400).json({ error: "Invalid OTP" });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: "Failed to verify OTP" });
        });
}

exports.logout = async (req, res) => {
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
};

// verify session
exports.verifySession = async (req, res) => {
    // User session is valid
    res.sendStatus(200);
}

// new implementation
// exports.register = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const newUser = await register(email, password, 'user');

//         res.status(200).json({ message: 'sucessfully registered' });
//     } catch (error) {
//         console.error(error);
//         if (error.message) {
//             return res.status(400).json({ error: error.message });
//         }
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };