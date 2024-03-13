const bcrypt = require('bcrypt');
const modelResolver = require('./query');

exports.register = async (email, password, role = "user") => {
    try {
        if (!email) {
            throw new Error('Email is required');
        }
        if (!password) {
            throw new Error('Password is required');
        }
        if (!role) {
            throw new Error('Role is required');
        }

        const Model = modelResolver(role);
        const hashedPassword = await bcrypt.hash(password, 10);

        // check if the email already exists
        const isEmailAlreadyRegistered = await Model.findOne({ email });
        if (isEmailAlreadyRegistered) {
            throw new Error('Email already exists');
        }

        // create a new user
        const newUser = await Model.create({
            email,
            password: hashedPassword,
        });

        return newUser;

    } catch (error) {
        throw error;
    }
};