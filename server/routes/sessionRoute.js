import express from 'express';
import { body, validationResult } from 'express-validator'
import { getSession, createSession, leaveSession, endSession, JoinSession, listSession } from '../controllers/sessionControllers.js';
import { generateLivekitToken } from '../controllers/livekitController.js';
import { protect } from '../middleware/auth.js';


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
router.post('/create', createSession)


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


//GET /api/session/:roomId (dynamic route must be last)
router.get('/:roomId', getSession)




export default router;