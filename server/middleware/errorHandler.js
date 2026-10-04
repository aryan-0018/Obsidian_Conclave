


const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(error => error.message).join(', ');
    }

    // Mongoose bad ObjectId / CastError
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Resource not found or invalid ID format';
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid Token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    // Sanitize 500 internal errors in production to prevent leaking server details
    if (statusCode === 500 && process.env.NODE_ENV === 'production') {
        message = 'An unexpected internal error occurred. Please try again later.';
    }

    console.error(`[Security/Error] ${req.method} ${req.originalUrl}:`, err.message || err);

    res.status(statusCode).json({
        success: false,
        error: message,
    });
};

export default errorHandler;