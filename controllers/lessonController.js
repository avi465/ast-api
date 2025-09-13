const Lesson = require("../models/Lesson");
const Module = require("../models/Module");
const {errorResponse, successResponse} = require("../utils/response");

exports.createLesson = async (req, res) => {
    const lessonData = req.body;

    try {
        const lesson = new Lesson({
            title: lessonData.title,
            description: lessonData.description,
            startTime: lessonData.startTime,
            endTime: lessonData.endTime,
            videoUrl: lessonData.videoUrl,
            type: lessonData.type,
            status: lessonData.status || 'scheduled',
            stream: lessonData.stream,
            course: lessonData.course,
            module: lessonData.module,
            slides: lessonData.slides || [],
            images: lessonData.images || [],
            instructor: lessonData.instructor,
            quizzes: lessonData.quizzes || [],
        });

        await lesson.save();
        successResponse(res, "Lesson created successfully", 201, lesson);
    } catch (err) {
        errorResponse(res, "Failed to create lesson", 400, [err.message]);
    }
}

exports.getAllLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find()
            .populate('stream')
            .populate('images');

        successResponse(res, "Lessons retrieved successfully", 200, lessons);
    } catch (err) {
        errorResponse(res, "Failed to retrieve lessons", 400, [err.message]);
    }
}

exports.getLessonsByCourseId = async (req, res) => {
    const courseId = req.params.courseId;

    try {
        const modules = await Module.find({ course: courseId }).select('_id');
        const moduleIds = modules.map(m => m._id);

        if (moduleIds.length === 0) {
            return errorResponse(res, "No modules found for this course", 404);
        }

        const lessons = await Lesson.find({ module: { $in: moduleIds } })
            .populate('stream')
            .populate('images');

        if (!lessons) {
            return errorResponse(res, "No lessons found for this course", 404);
        }

        successResponse(res, "Lessons retrieved successfully", 200, lessons);
    } catch (err) {
        errorResponse(res, "Failed to retrieve lessons", 400, [err.message]);
    }
}

exports.getLessonById = async (req, res) => {
    const lessonId = req.params.lessonId;

    try {
        const lesson = await Lesson.findById(lessonId)
            .populate('stream')
            .populate('images')

        if (!lesson) {
            return errorResponse(res, "Lesson not found", 404);
        }

        successResponse(res, "Lesson retrieved successfully", 200, lesson);
    }
    catch (err) {
        errorResponse(res, "Failed to retrieve lesson", 400, [err.message]);
    }
}

exports.updateLesson = async (req, res) => {
    const lessonId = req.params.lessonId;
    const updateData = req.body;

    try {
        const lesson = await Lesson.findByIdAndUpdate(lessonId, updateData, { new: true })

        if (!lesson) {
            return errorResponse(res, "Lesson not found", 404);
        }
        successResponse(res, "Lesson updated successfully", 200, lesson);
    }
    catch (err) {
        errorResponse(res, "Failed to update lesson", 400, [err.message]);
    }
}

exports.deleteLesson = async (req, res) => {
    const lessonId = req.params.lessonId;

    try {
        const lesson = await Lesson.findByIdAndDelete(lessonId);
        if (!lesson) {
            return errorResponse(res, "Lesson not found", 404);
        }
        successResponse(res, "Lesson deleted successfully", 200, lesson);
    }
    catch (err) {
        errorResponse(res, "Failed to delete lesson", 400, [err.message]);
    }
}
