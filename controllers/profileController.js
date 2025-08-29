const user = require("../models/User");
const admin = require("../models/Admin");
const {errorResponse, successResponse} = require("../utils/response");

exports.getUserProfile = async (req, res) => {
    const userId = req.user._id;

    try {
        const userProfile = await user.findById(userId).select('name email phone');

        if (!userProfile) {
            return errorResponse(res, "User profile not found", 404);
        }

        successResponse(res, "User profile retrieved successfully", 200, userProfile);
    } catch (err) {
        errorResponse(res, "Failed to retrieve user profile", 400, [err.message]);
    }
}

exports.getAdminProfile = async (req, res) => {
    const adminId = req.admin._id;

    try {
        const adminProfile = await admin.findById(adminId).select('name email phone');

        if (!adminProfile) {
            return errorResponse(res, "Admin profile not found", 404);
        }

        successResponse(res, "Admin profile retrieved successfully", 200, adminProfile);
    } catch (err) {
        errorResponse(res, "Failed to retrieve admin profile", 400, [err.message]);
    }
}

exports.updateUserProfile = async (req, res) => {
    const userId = req.user._id;
    const { name, email, phone } = req.body;

    try {
        const updatedUser = await user.findByIdAndUpdate(
            userId,
            { name, email, phone },
            { new: true, runValidators: true, select: 'name email phone' }
        );

        if (!updatedUser) {
            return errorResponse(res, "User profile not found", 404);
        }

        successResponse(res, "User profile updated successfully", 200, updatedUser);
    } catch (err) {
        errorResponse(res, "Failed to update user profile", 400, [err.message]);
    }
}

exports.updateAdminProfile = async (req, res) => {
    const adminId = req.admin._id;
    const { name, email, phone } = req.body;

    try {
        const updatedAdmin = await admin.findByIdAndUpdate(
            adminId,
            { name, email, phone },
            { new: true, runValidators: true, select: 'name email phone' }
        );

        if (!updatedAdmin) {
            return errorResponse(res, "Admin profile not found", 404);
        }

        successResponse(res, "Admin profile updated successfully", 200, updatedAdmin);
    } catch (err) {
        errorResponse(res, "Failed to update admin profile", 400, [err.message]);
    }
}