const Product = require('../models/Product');
const Payment = require('../models/Payment');
const Category = require('../models/Category');
const Image = require('../models/Image');
const { successResponse, errorResponse } = require('../utils/response');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "images",
                select: ["_id", "url", "altText"], // only select the _id and url fields
            })
            .populate({
                path: "category",
            });

        if (!products || products.length === 0) {
            console.warn("No products found in the database.");
            return successResponse(res, 'No products found', 204, []);
        }

        successResponse(res, 'Courses fetched successfully', 200, products);

    } catch (error) {
        console.error(error);
        errorResponse(res, 'Internal Server Error', 500, [error]);
    }
};

// Get courses purchansed by user
exports.getPurchasedCourses = async (req, res) => {
    try {
        const userId = req.session.userId;

        const purchasedCourses = await Payment.find({ user: userId })
            .populate({
                path: "order",
                select: "course", // only populate the course field
                populate: {
                    path: "course",
                    select: "_id", // only select the _id
                },
            });

        if (purchasedCourses.length === 0) {
            return successResponse(res, 'No purchased courses found', 200, null);
        }

        // Extract course IDs from the populated data
        const courseIds = purchasedCourses.map(payment => payment.order.course?._id);

        // Fetch course details using the extracted IDs
        const purchasedCoursesDetails = await Product.find({ _id: { $in: courseIds } })
            .populate({
                path: "images",
                select: ["_id", "url", "altText"], // only select the _id and url fields
            })
            .populate({
                path: "category",
            });

        if (purchasedCoursesDetails.length === 0) {
            return successResponse(res, 'No purchased courses details found', 204, []);
        }

        successResponse(res, 'Purchased courses fetched successfully', 200, purchasedCoursesDetails);
        // return res.status(200).json({
        //     courses: purchasedCoursesDetails,
        //     partiallyMissing: validPayments.length < purchasedCourses.length
        // });

    } catch (error) {
        console.error(error);
        errorResponse(res, 'Internal Server Error', 500, [error]);
    }
};

exports.getRecommendedProducts = async (req, res) => {
    try {
        // todo: this is just fetching latest 3 products
        // need proper recommendation for every users
        const recommendedProducts = await Product.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .populate({
                path: "images",
                select: ["_id", "url", "altText"],
            })
            .populate({
                path: "category",
            });

        if (!recommendedProducts || recommendedProducts.length === 0) {
            return successResponse(res, 'No recommended products found', 204, []);
        }

        // Filter out products that are not active
        const activeProducts = recommendedProducts.filter(product => product.isActive);

        if (activeProducts.length === 0) {
            return successResponse(res, 'No recommended products found', 204, []);
        }

        successResponse(res, 'Recommended products fetched successfully', 200, activeProducts);

    } catch (error) {
        console.error(error);
        errorResponse(res, 'Internal Server Error', 500, [error]);
    }
}

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId)
            .populate({
                path: "images",
                select: ["_id", "url", "altText"], // only select the _id and url fields
            })
            .populate({
                path: "category",
            });

        if (!product) {
            successResponse(res, 'Product not found', 204, []);
        }

        successResponse(res, 'Product fetched successfully', 200, product);

    } catch (error) {
        console.error(error);
        errorResponse(res, 'Internal Server Error', 500, [error]);
    }
};

// Add a new product

exports.addProduct = async (req, res) => {
    try {
        const { name, description, details, price, discount, category, images, ratings } = req.body;

        // Validate if category exists
        const existingCategory = await Category.findById(category);

        if (!existingCategory) {
            return errorResponse(res, 'Category not found', 400, []);
        }

        // Validate if images exist
        const validateIfImagesExist = await Image.find({ _id: { $in: images } });
        if (validateIfImagesExist.length !== images.length) {
            return errorResponse(res, 'Some images not found', 400, []);
        }

        // Create a new product instance
        const product = new Product({
            name,
            description,
            details,
            price,
            discount,
            category,
            images, // Should be array of ObjectId strings
            ratings
        });

        // Save the product to the database
        await product.save();

        successResponse(res, 'Product created successfully', 201, product);

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            errorResponse(res, `A product with same [${field}] already exists.`, 400, []);
        }

        console.error(error);
        errorResponse(res, 'Internal Server Error', 500, [error]);
    }
};

// Update a product
// todo: need to be checked to compatible with the model
exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, price, discount, category } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(productId,
            {
                name,
                description,
                price,
                discount,
                category
            },
            { new: true }
        );
        if (!updatedProduct) {
            return errorResponse(res, 'Product not found', 404, []);
        }

        successResponse(res, 'Product updated successfully', 201, updatedProduct);

    } catch (error) {
        console.error(error);
        errorResponse(res, 'Internal Server Error', 500, [error]);
    }
};

// Delete a product
// Danger: deleting product once user purchase will
// create issue insted add flag to products as isActive
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return errorResponse(res, 'Product not found', 404, []);
        }

        successResponse(res, 'Product deleted successfully', 200, deletedProduct);

    } catch (error) {
        console.error(error);
        errorResponse(res, 'Internal Server Error', 500, [error]);
    }
};

// Get all products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const product = Product.findById(categoryId);
        if (!product) {
            return errorResponse(res, 'Product not found', 404, []);
        }

    } catch (error) {
        console.error(error);
        errorResponse(res, 'Internal Server Error', 500, [error]);

    }
}

// Create a new product category
exports.createProductCategory = async (req, res) => {
    try {
        const { name, description, icon } = req.body;

        const newCategory = new Category({ name, description, icon });

        await newCategory.save();

        successResponse(res, 'Product category created successfully', 201, newCategory);

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            errorResponse(res, `A category with same [${field}] already exists.`, 400, []);
        }

        console.error(error);
        errorResponse(res, 'Internal Server Error', 500, [error]);
    }
};

// Get all product categories
exports.getAllProductCategories = async (req, res) => {
    try {
        const categories = await Category.find();

        if (!categories || categories.length === 0) {
            return successResponse(res, 'No product categories found', 204, []);
        }

        successResponse(res, 'Product categories fetched successfully', 200, categories);

    } catch (error) {
        console.error(error);
        errorResponse(res, 'Internal Server Error', 500, [error]);
    }
};
