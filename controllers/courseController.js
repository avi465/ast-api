const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Category = require('../models/Category');
const Image = require('../models/Image');
const Module = require('../models/Module');
const { successResponse, errorResponse } = require('../utils/response');

// Get all courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "images",
            })
            .populate({
                path: "category",
            });

        if (!courses) {
            return successResponse(res, 'No products found', 204, []);
        }

        successResponse(res, 'Courses fetched successfully', 200, courses);

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

        if (!purchasedCourses) {
            return successResponse(res, 'No purchased courses found', 200, null);
        }

        // Extract course IDs from the populated data
        const courseIds = purchasedCourses.map(payment => payment.order.course?._id);

        // Fetch course details using the extracted IDs
        const purchasedCoursesDetails = await Course.find({ _id: { $in: courseIds } })
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
    } catch (error) {
        console.error(error);
        errorResponse(res, 'Internal Server Error', 500, [error.message]);
    }
};

exports.getLatestCourses = async (req, res) => {
    try {
        const latestCourses = await Course.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .populate({
                path: "images",
                select: ["_id", "url", "altText"],
            })
            .populate({
                path: "category",
            });

        if (!latestCourses) {
            return successResponse(res, 'No latest courses found', 204, []);
        }

        // Filter out products that are not active
        const activeCourses = latestCourses.filter(course => course.isActive);

        if (activeCourses.length === 0) {
            return successResponse(res, 'No latest courses found', 204, []);
        }

        successResponse(res, 'Latest courses fetched successfully', 200, activeCourses);
    } catch (error) {
        errorResponse(res, 'Internal Server Error', 500, [error.message]);
    }
}

// Get a single course by ID
exports.getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;

        const course = await Course.findById(courseId)
            .populate({
                path: "images",
                select: ["_id", "url", "altText"]
            })
            .populate({
                path: "category",
            });

        if (!course) {
            successResponse(res, 'Course not found', 204, []);
        }

        successResponse(res, 'Course fetched successfully', 200, course);

    } catch (error) {
        console.error(error);
        errorResponse(res, 'Internal Server Error', 500, [error]);
    }
};

// Add a new product

exports.addCourse = async (req, res) => {
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
            return errorResponse(res, 'Image/s not found', 400, []);
        }

        const course = new Course({
            name,
            description,
            details,
            price,
            discount,
            category,
            images, // Should be array of ObjectId strings
            ratings
        });

        // create default module for course
        const defaultModule = new Module({
            title: 'Default Module',
            description: 'System generated default module',
            course: course._id,
            lessons: [],
            isDefault: true,
            status: 'published',
            topicsCovered: []
        });

        await defaultModule.save();
        course.modules.push(defaultModule._id);

        await course.save();
        successResponse(res, 'Course created successfully', 201, course);

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            errorResponse(res, `A course with same [${field}] already exists.`, 400, []);
        }

        console.error(error);
        errorResponse(res, 'Internal Server Error', 500, [error]);
    }
};

// Update a product
// todo: need to be checked to compatible with the model
exports.updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const { name, description, price, discount, category } = req.body;

        const updatedCourse = await Product.findByIdAndUpdate(courseId,
            {
                name,
                description,
                price,
                discount,
                category
            },
            { new: true }
        );
        if (!updatedCourse) {
            return errorResponse(res, 'Course not found', 404, []);
        }
        successResponse(res, 'Course updated successfully', 201, updatedCourse);

    } catch (error) {
        errorResponse(res, 'Internal Server Error', 500, [error.message]);
    }
};

// Delete a course
// Danger: deleting course once user purchase will
// create issue instead add flag to products as isActive
exports.deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;

        const deletedCourse = await Course.findByIdAndDelete(courseId);

        if (!deletedCourse) {
            return errorResponse(res, 'Course not found', 404, []);
        }

        successResponse(res, 'Course deleted successfully', 200, deletedCourse);

    } catch (error) {
        console.error(error);
        errorResponse(res, 'Internal Server Error', 500, [error.message]);
    }
};

// Get all course by category
exports.getCoursesByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const course = Course.findById(categoryId);
        if (!course) {
            return errorResponse(res, 'Course not found', 404, []);
        }

    } catch (error) {
        errorResponse(res, 'Internal Server Error', 500, [error.message]);
    }
}

// Create a new course category
exports.createCourseCategory = async (req, res) => {
    try {
        const { name, description, icon } = req.body;
        const newCategory = new Category({ name, description, icon });
        await newCategory.save();
        successResponse(res, 'Course category created successfully', 201, newCategory);

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            errorResponse(res, `A category with same [${field}] already exists.`, 400, []);
        }
        errorResponse(res, 'Internal Server Error', 500, [error.message]);
    }
};

// Get all course categories
exports.getAllCourseCategories = async (req, res) => {
    try {
        const categories = await Category.find();

        if (!categories) {
            return successResponse(res, 'No course categories found', 204, []);
        }
        successResponse(res, 'Course categories fetched successfully', 200, categories);

    } catch (error) {
        errorResponse(res, 'Internal Server Error', 500, [error.message]);
    }
};
