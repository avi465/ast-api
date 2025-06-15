exports.successResponse = (res, message, statusCode = 200, data = {}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        errors: null,
    });
};

exports.errorResponse = (res, message, statusCode = 400, errors = []) => {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
        errors,
    });
};