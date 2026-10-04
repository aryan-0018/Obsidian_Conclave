import rateLimit from 'express-rate-limit';

// Rate limiter for authentication routes (login / register) to prevent brute-force attacks
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 requests per IP per window
    message: {
        success: false,
        error: 'Too many authentication attempts. Please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for creating sessions to prevent room flooding
export const createSessionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // 30 rooms per IP per window
    message: {
        success: false,
        error: 'Too many conclaves created recently. Please try again shortly.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 600, // Generous limit for real-time polling
    message: {
        success: false,
        error: 'Too many requests from this IP. Please slow down.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
