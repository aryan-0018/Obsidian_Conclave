import express from 'express';
import { body, param, validationResult } from 'express-validator';
import {
    getSession,
    createSession,
    leaveSession,
    endSession,
    JoinSession,
    listSession,
    admitParticipant,
    denyParticipant,
    removeParticipant,
} from '../controllers/sessionControllers.js';
import { generateLivekitToken, muteParticipant, stopScreenShare } from '../controllers/livekitController.js';
import { protect } from '../middleware/auth.js';
import { createSessionLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

//validation middleware
const handleValidationError = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array()[0].msg
        });
    }
    next();
};

router.use(protect);

//GET /api/session/list
router.get('/list', listSession);

//POST /api/session/create
router.post(
    '/create',
    createSessionLimiter,
    [
        body('meetingType')
            .optional()
            .isIn(['public', 'private'])
            .withMessage('Meeting type must be either public or private'),
    ],
    handleValidationError,
    createSession
);

//POST /api/session/join
router.post(
    '/join',
    [
        body('roomId')
            .trim()
            .isAlphanumeric()
            .isLength({ min: 12, max: 12 })
            .withMessage('Invalid room ID format (must be 12 alphanumeric characters)'),
    ],
    handleValidationError,
    JoinSession
);

//POST /api/session/end
router.post(
    '/end/:sessionId',
    [
        param('sessionId')
            .isMongoId()
            .withMessage('Invalid session ID'),
    ],
    handleValidationError,
    endSession
);

//POST /api/session/leave
router.post(
    '/leave',
    [
        body('roomId')
            .trim()
            .isAlphanumeric()
            .isLength({ min: 12, max: 12 })
            .withMessage('Invalid room ID format'),
    ],
    handleValidationError,
    leaveSession
);

//POST /api/session/livekit-token
router.post(
    '/livekit-token',
    [
        body('roomId')
            .trim()
            .isAlphanumeric()
            .isLength({ min: 12, max: 12 })
            .withMessage('Invalid room ID format'),
    ],
    handleValidationError,
    generateLivekitToken
);

// ========================================
// Waiting Room Routes (Host only)
// ========================================

//POST /api/session/admit
router.post(
    '/admit',
    [
        body('roomId').trim().isAlphanumeric().isLength({ min: 12, max: 12 }).withMessage('Invalid room ID'),
        body('pendingUserId').isMongoId().withMessage('Invalid participant ID'),
    ],
    handleValidationError,
    admitParticipant
);

//POST /api/session/deny
router.post(
    '/deny',
    [
        body('roomId').trim().isAlphanumeric().isLength({ min: 12, max: 12 }).withMessage('Invalid room ID'),
        body('pendingUserId').isMongoId().withMessage('Invalid participant ID'),
    ],
    handleValidationError,
    denyParticipant
);

// ========================================
// Host Control Routes
// ========================================

//POST /api/session/remove
router.post(
    '/remove',
    [
        body('roomId').trim().isAlphanumeric().isLength({ min: 12, max: 12 }).withMessage('Invalid room ID'),
        body('targetUserId').isMongoId().withMessage('Invalid participant ID'),
    ],
    handleValidationError,
    removeParticipant
);

//POST /api/session/mute
router.post(
    '/mute',
    [
        body('roomId').trim().isAlphanumeric().isLength({ min: 12, max: 12 }).withMessage('Invalid room ID'),
        body('participantIdentity').trim().notEmpty().withMessage('Participant identity is required'),
    ],
    handleValidationError,
    muteParticipant
);

//POST /api/session/stop-screenshare
router.post(
    '/stop-screenshare',
    [
        body('roomId').trim().isAlphanumeric().isLength({ min: 12, max: 12 }).withMessage('Invalid room ID'),
        body('participantIdentity').trim().notEmpty().withMessage('Participant identity is required'),
    ],
    handleValidationError,
    stopScreenShare
);

//GET /api/session/:roomId (dynamic route must be last)
router.get(
    '/:roomId',
    [
        param('roomId')
            .trim()
            .isAlphanumeric()
            .isLength({ min: 12, max: 12 })
            .withMessage('Invalid room ID format'),
    ],
    handleValidationError,
    getSession
);

export default router;