import express from 'express';
import { body, validationResult } from 'express-validator'
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
        })
    }

    next();
}


router.use(protect)

//GET /api/session/list

router.get('/list', listSession)


//POST /api/session/create
router.post('/create', createSessionLimiter, createSession)


//POST /api/session/join
router.post(
    '/join',
    [
        body('roomId')
            .trim()
            .notEmpty()
            .withMessage('RoomId is required'),
    ],
    handleValidationError,
    JoinSession
)


//POST /api/session/end
router.post('/end/:sessionId', endSession)


//POST /api/session/leave
router.post(
    '/leave',
    [
        body('roomId')
            .trim()
            .notEmpty()
            .withMessage('RoomId is required'),
    ],
    handleValidationError,
    leaveSession
)


//POST /api/session/livekit-token
router.post('/livekit-token', generateLivekitToken)


// ========================================
// Waiting Room Routes (Host only)
// ========================================

//POST /api/session/admit
router.post('/admit', admitParticipant)

//POST /api/session/deny
router.post('/deny', denyParticipant)


// ========================================
// Host Control Routes
// ========================================

//POST /api/session/remove
router.post('/remove', removeParticipant)

//POST /api/session/mute
router.post('/mute', muteParticipant)

//POST /api/session/stop-screenshare
router.post('/stop-screenshare', stopScreenShare)


//GET /api/session/:roomId (dynamic route must be last)
router.get('/:roomId', getSession)




export default router;