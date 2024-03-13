const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId)
            .populate('brand')
            .populate('category')
            .exec();

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Add a new product

exports.addProduct = async (req, res) => {
    try {
        const { name, price, description, category } = req.body;

        // Access the resized image files from req.files
        // const imageVariations = req.imageVariations || [];
        const images = req.files || [];
        // Format the image data
        const formattedImages = images.map((image) => {
            return {
                url: image.path,
                altText: `Product ${name} - ${image.filename}`,
            };
        });

        // Create a new product instance
        const product = new Product({
            name,
            price,
            description,
            images: formattedImages,
        });

        // Save the product to the database
        await product.save();

        res.status(200).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, price, discount, stock, brand, category, seller, color, size, material, height, weight, dimension, url } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                name,
                price,
                description
            },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
