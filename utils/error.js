const sucess = (res, data) => {
    res.status(200).json({
        success: true,
        message: 'Resource retrieved successfully',
        data: { /* Response data */ },
    });
}

const validationError = (res, message) => {
    res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'One or more fields are invalid',
        errors: { /* Validation errors */ },
    });
}

const authenticationError = (res, message) => {
    res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication failed',
    });
}

const serverError = (res, message) => {
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Something went wrong',
    });
}

const notFound = (res, message) => {
    res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Resource not found',
    });
}

module.exports = {
    sucess,
    validationError,
    authenticationError,
    serverError,
    notFound,
}