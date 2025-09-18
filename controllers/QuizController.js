const Lesson = require("../models/Lesson");
const Module = require("../models/Module");
const {errorResponse, successResponse} = require("../utils/response");

exports.getQuizByLessonId = async (req, res) => {
    const lessonId = req.params.lessonId;

    try {
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return errorResponse(res, "Lesson not found", 404);
        }
        if (!lesson.quiz || lesson.quiz.length === 0) {
            return errorResponse(res, "No quiz found for this lesson", 404);
        }
        successResponse(res, "Quiz retrieved successfully", 200, lesson.quiz);
    }
    catch (error) {
        errorResponse(res, "Failed to retrieve quiz", 400, [error.message]);
    }
}

exports.getQuizByCourseId = async (req, res) => {
    const courseId = req.params.courseId;

    try {
        const modules = await Module.find({ course: courseId }).select('_id');
        const moduleIds = modules.map(m => m._id);

        if (moduleIds.length === 0) {
            return errorResponse(res, "No modules found for this course", 404);
        }

        const lessons = await Lesson.find({ module: { $in: moduleIds } }).select('quiz title');

        if (!lessons || lessons.length === 0) {
            return errorResponse(res, "No lessons found for this course", 404);
        }

        const quizzes = lessons
            .filter(lesson => lesson.quiz && lesson.quiz.length > 0)
            .map(lesson => ({
                lessonTitle: lesson.title,
                quiz: lesson.quiz
            }));

        if (quizzes.length === 0) {
            return errorResponse(res, "No quizzes found for this course", 404);
        }

        successResponse(res, "Quizzes retrieved successfully", 200, quizzes);
    } catch (error) {
        errorResponse(res, "Failed to retrieve quizzes", 400, [error.message]);
    }
}