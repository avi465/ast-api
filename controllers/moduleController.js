const Module = require("../models/Module");
const {errorResponse, successResponse} = require("../utils/response");

exports.createModule = async (req, res) => {
    const moduleData = req.body;

    try {
        const module = new Module({
            title: moduleData.title,
            description: moduleData.description,
            course: moduleData.course,
            lessons: moduleData.lessons || [],
            isDefault: moduleData.isDefault || false,
            status: moduleData.status || 'draft',
            topicsCovered: moduleData.topicsCovered || []
        });

        await module.save();
        successResponse(res, "Module created successfully", 201, module);
    } catch (err) {
        errorResponse(res, "Failed to create module", 400, [err.message]);
    }
}

exports.getModules = async (req, res) => {
    try {
        const modules = await Module.find().populate('course');

        successResponse(res, "Modules retrieved successfully", 200, modules);
    } catch (err) {
        errorResponse(res, "Failed to retrieve modules", 400, [err.message]);
    }
}

exports.getModuleById = async (req, res) => {
    const moduleId = req.params.moduleId;

    try {
        const module = await Module.findById(moduleId).populate('course');
        if (!module) {
            return errorResponse(res, "Module not found", 404);
        }
        successResponse(res, "Module retrieved successfully", 200, module);
    }catch (error) {
        errorResponse(res, "Failed to retrieve module", 400, [error.message]);
    }
}

exports.getModulesByCourseId = async (req, res) => {
    const courseId = req.params.courseId;

    try {
        const modules = await Module.find({ course: courseId });

        if (!modules || modules.length === 0) {
            return errorResponse(res, "No modules found for this course", 404);
        }

        successResponse(res, "Modules retrieved successfully", 200, modules);
    } catch (err) {
        errorResponse(res, "Failed to retrieve modules", 400, [err.message]);
    }
}