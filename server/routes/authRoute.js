import express from 'express';
import { body, validationResult } from 'express-validator'
import { getMe, login, register, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';


const router = express.Router();


//validation middleware
const handleValidationError = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array()[0].msg
        })
    }

    next();
}


//POST /api/auth/register

router.post(
    '/register',
    authLimiter,
    [
        body('name')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters'),
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),
        body('password')
            .isLength({ min: 6, max: 128 })
            .withMessage('Password must be between 6 and 128 characters')
    ],
    handleValidationError,
    register
)



//POST /api/auth/login

router.post(
    '/login',
    authLimiter,
    [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),
        body('password')
            .isLength({ min: 6, max: 128 })
            .withMessage('Password must be between 6 and 128 characters')
    ],
    handleValidationError,
    login
)


//GET /api/auth/me
router.get('/me', protect, getMe)

//PUT /api/auth/update
router.put(
    '/update',
    protect,
    [
        body('name')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters'),
        body('profilePicture')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 200000 })
            .withMessage('Profile picture is too large (max 200KB)')
    ],
    handleValidationError,
    updateProfile
)

export default router;