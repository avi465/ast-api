const Stream = require('../models/Stream');
const Lesson = require("../models/Lesson");
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const crypto = require('crypto');
const { errorResponse, successResponse } = require("../utils/response");

exports.createStream = async (req, res) => {
    const { lesson } = req.body;
    const streamKey = crypto.randomBytes(16).toString('hex');
    try {
        const stream = new Stream({
            streamKey: streamKey,
            lesson: lesson,
            createdBy: req.admin ? req.admin._id : null
        });

        // update lesson to link to this stream
        if (!stream.lesson) {
            return errorResponse(res, "Lesson ID is required to create a stream", 400);
        }

        // after creating the stream, update the lesson to reference this stream
        const lessonDoc = await Lesson.findByIdAndUpdate(stream.lesson, { stream: stream._id }, { new: true });

        if (!lessonDoc) {
            return errorResponse(res, "Lesson not found", 404);
        }

        await lessonDoc.save();
        await stream.save();

        successResponse(res, "Stream created successfully", 201, stream);
    } catch (err) {
        errorResponse(res, "Failed to create stream", 400, [err.message]);
    }
}

exports.getAllStreams = async (req, res) => {
    try {
        const streams = await Stream.find().populate('lesson');
        successResponse(res, "Streams fetched successfully", 200, streams);
    } catch (err) {
        errorResponse(res, "Failed to fetch streams", 400, [err.message]);
    }
}

exports.getStreamById = async (req, res) => {
    const { id } = req.params;
    try {
        const stream = await Stream.findById(id).populate('lesson')
        if (!stream) {
            return errorResponse(res, "Stream not found", 404);
        }
        successResponse(res, "Stream fetched successfully", 200, stream);
    } catch (err) {
        errorResponse(res, "Failed to fetch stream", 400, [err.message]);
    }
}

exports.getStreamForCurrentUser = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { status } = req.query;

        // Get purchased course IDs
        const payments = await Payment.find({ user: userId }).populate({
            path: "order",
            select: "course",
            populate: { path: "course", select: "_id" }
        });
        const courseIds = payments.map(p => p.order?.course?._id).filter(Boolean);

        if (courseIds.length === 0) {
            return successResponse(res, "No purchased courses found", 200, []);
        }

        // Aggregation: Course → Module → Lesson → Stream
        const streams = await Stream.aggregate([
            {
                $lookup: {
                    from: "lessons",
                    localField: "lesson",
                    foreignField: "_id",
                    as: "lesson"
                }
            },
            { $unwind: "$lesson" },
            {
                $lookup: {
                    from: "modules",
                    localField: "lesson.module",
                    foreignField: "_id",
                    as: "module"
                }
            },
            { $unwind: "$module" },
            {
                $match: {
                    "module.course": { $in: courseIds },
                    ...(status ? { "lesson.status": status } : {})
                }
            }
        ]);

        successResponse(res, "Streams fetched successfully", 200, streams);
    } catch (err) {
        errorResponse(res, "Failed to fetch streams", 500, [err.message]);
    }
}