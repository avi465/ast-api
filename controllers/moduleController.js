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