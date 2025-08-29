const Slide = require('../models/Slide');
const File = require('../models/File');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const { validateSlide } = require('../validations/slideValidation');
const { errorResponse, successResponse } = require('../utils/response');

exports.getSlidesByLessonId = async (req, res) => {
    const { lessonId } = req.params;

    try {
        const slides = await Slide.find({ lesson: lessonId })
            .populate('file', 'url name')
            .populate('lesson', 'title');

        if (!slides || slides.length === 0) {
            return errorResponse(res, "No slides found for this lesson", 404);
        }

        successResponse(res, "Slides retrieved successfully", 200, slides);
    } catch (err) {
        errorResponse(res, "Failed to retrieve slides", 400, [err.message]);
    }
}

exports.getSlidesByCourseId = async (req, res) => {
    const { courseId } = req.params;

    try {
        // Find modules for the course
        const modules = await Module.find({ course: courseId }).select('_id');
        const moduleIds = modules.map(m => m._id);

        if (moduleIds.length === 0) {
            return errorResponse(res, "No modules found for this course", 404);
        }

        // Find lessons for the modules
        const lessons = await Lesson.find({ module: { $in: moduleIds } }).select('_id');
        const lessonIds = lessons.map(l => l._id);

        if (lessonIds.length === 0) {
            return errorResponse(res, "No lessons found for this course", 404);
        }

        // Find slides for the lessons
        const slides = await Slide.find({ lesson: { $in: lessonIds } })
            .populate('file', 'filename mimetype size path')
            .populate('lesson', 'title type');

        if (!slides) {
            return errorResponse(res, "No slides found for this course", 404);
        }

        successResponse(res, "Slides retrieved successfully", 200, slides);
    } catch (err) {
        errorResponse(res, "Failed to retrieve slides", 400, [err.message]);
    }
};

exports.createSlide = async (req, res) => {
    const { lesson, file ,title } = req.body;

    // Validate input
    const { error } = validateSlide(req.body);
    if (error) {
        return errorResponse(res, "Validation error", 400, [error.details[0].message]);
    }

    try {
        const slide = new Slide({
            title :title,
            lesson: lesson,
            file: file
        });

        await slide.save();
        successResponse(res, "Slide created successfully", 201, slide);
    } catch (err) {
        errorResponse(res, "Failed to create slide", 400, [err.message]);
    }
};