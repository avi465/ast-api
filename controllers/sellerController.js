const bcrypt = require('bcrypt');
const Product = require('../models/Product');
const Seller = require('../models/Seller');

const sellerRegister = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if the email already exists
        if (email) {
            const existingEmailUser = await Seller.findOne({ email });
            if (existingEmailUser) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            // Check if the password is provided
            if (!password) {
                return res.status(400).json({ error: 'Password is required' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const newUser = new Seller({
                name,
                email,
                password: hashedPassword,
            });
            await newUser.save();
        }

        // Check if the phone number already exists
        if (phone) {
            const existingPhoneUser = await Seller.findOne({ phone });
            if (existingPhoneUser) {
                return res.status(400).json({ error: 'Phone number already exists' });
            }
            // Use Twilio Verify to send a verification code to the user's phone number
            twilio.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
                .verifications
                .create({ to: phone, channel: 'sms' })
                .then(verification => console.log(verification.status));

            // Create a new user
            const newUser = new Seller({
                name,
                phone,
            });
            await newUser.save();
        }

        res.json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// User login
const sellerLogin = async (req, res) => {
    const { email, password, rememberMe } = req.body;

    try {
        // Find the user by email
        const user = await Seller.findOne({ email });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({ error: 'Invalid email' });
        }

        // Validate the password
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Log in the user

        // Set the user ID in the session
        req.session.sellerId = user._id;

        // Set the session expiration if rememberMe is true
        if (rememberMe) {
            req.session.cookie.expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        }

        // Respond with a success message
        res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// User logout
const sellerLogout = async (req, res) => {
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

const addProduct = async (req, res) => {
    try {
        // Get the product details from the request body
        const { name, price, description } = req.body;

        // Create a new product
        const newProduct = new Product({
            name,
            price,
            description,
            seller: req.seller._id,
        });

        // Save the new product to the database
        const savedProduct = await newProduct.save();

        // Return the saved product as the API response
        res.json({ product: savedProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const editProduct = async (req, res) => {
    try {
        // Get the product ID from the request parameters
        const productId = req.params.productId;

        // Fetch the product from the database
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if the logged-in seller is the owner of the product
        if (product.seller.toString() !== req.seller._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Update the product details
        product.name = req.body.name;
        product.price = req.body.price;
        product.description = req.body.description;

        // Save the updated product to the database
        const updatedProduct = await product.save();

        // Return the updated product as the API response
        res.json({ product: updatedProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const deleteProduct = async (req, res) => {
    try {
        // Get the product ID from the request parameters
        const productId = req.params.productId;

        // Fetch the product from the database
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if the logged-in seller is the owner of the product
        if (product.seller.toString() !== req.seller._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Delete the product from the database
        await product.remove();

        // Return a success message as the API response
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    addProduct,
    editProduct,
    deleteProduct,
    sellerLogin,
    sellerLogout,
    sellerRegister
};
