import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import User from '../model/User.js';
import Session from '../model/Session.js';


// Helper to get RoomServiceClient
const getLivekitRoomService = () => {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const livekitUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !livekitUrl) {
        throw new Error('LiveKit credentials are not configured');
    }

    const httpUrl = livekitUrl.replace('wss://', 'https://');
    return new RoomServiceClient(httpUrl, apiKey, apiSecret);
};


export const generateLivekitToken = async (req, res, next) => {
    try {
        const { roomId } = req.body;
        const userId = req.user.userId;

        if (!roomId) {
            return res.status(400).json({
                success: false,
                error: 'Room ID is required'
            });
        }

        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;
        const livekitUrl = process.env.LIVEKIT_URL;

        if (!apiKey || !apiSecret) {
            return res.status(500).json({
                success: false,
                error: 'LiveKit credentials are not configured on the server'
            });
        }

        if (!livekitUrl) {
            return res.status(500).json({
                success: false,
                error: 'LiveKit server URL is not configured'
            });
        }

        // Verify user is an admitted participant (not just pending)
        const session = await Session.findOne({ roomId });
        if (session && session.meetingType === 'private') {
            const isParticipant = session.participants.some(
                (p) => p.userId.toString() === userId.toString()
            );
            if (!isParticipant) {
                return res.status(403).json({
                    success: false,
                    error: 'You have not been admitted to this private session yet'
                });
            }
        }

        // Look up user for their display name
        const user = await User.findById(userId);
        const userName = user?.name || `User_${userId}`;

        // Create an access token with the user's identity
        const at = new AccessToken(apiKey, apiSecret, {
            identity: userId.toString(),
            name: userName,
            ttl: '6h',
        });

        // Grant permissions to join the room, publish, and subscribe
        at.addGrant({
            roomJoin: true,
            room: roomId,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true,
        });

        const token = await at.toJwt();

        res.json({
            success: true,
            data: {
                token,
                url: livekitUrl,
            }
        });

    } catch (error) {
        next(error);
    }
}


// ========================================
// Host Controls: Mute Participant
// ========================================

export const muteParticipant = async (req, res, next) => {
    try {
        const { roomId, participantIdentity, trackSid, muted } = req.body;
        const userId = req.user.userId;

        // Verify host
        const session = await Session.findOne({ roomId });
        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }

        if (session.host.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, error: 'Only the host can mute participants' });
        }

        const roomService = getLivekitRoomService();

        if (trackSid) {
            // Mute a specific track
            await roomService.mutePublishedTrack(roomId, participantIdentity, trackSid, muted !== false);
        } else {
            // Get participant tracks and mute all audio tracks
            const participants = await roomService.listParticipants(roomId);
            const target = participants.find(p => p.identity === participantIdentity);

            if (!target) {
                return res.status(404).json({ success: false, error: 'Participant not found in room' });
            }

            for (const track of target.tracks) {
                if (track.type === 1 || track.source === 1) { // AUDIO type or MICROPHONE source
                    await roomService.mutePublishedTrack(roomId, participantIdentity, track.sid, muted !== false);
                }
            }
        }

        console.log(`[Host Control] Muted participant ${participantIdentity} in room ${roomId}. TrackSid: ${trackSid || 'All Audio'}`);

        res.json({
            success: true,
            data: { message: 'Participant muted successfully' }
        });

    } catch (error) {
        console.error(`[Host Control Error] Mute failed for ${participantIdentity} in ${roomId}:`, error.message);
        next(error);
    }
};


// ========================================
// Host Controls: Stop Screen Share
// ========================================

export const stopScreenShare = async (req, res, next) => {
    try {
        const { roomId, participantIdentity } = req.body;
        const userId = req.user.userId;

        // Verify host
        const session = await Session.findOne({ roomId });
        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }

        if (session.host.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, error: 'Only the host can stop screen sharing' });
        }

        const roomService = getLivekitRoomService();

        // Get participant tracks and mute screen share tracks
        const participants = await roomService.listParticipants(roomId);
        const target = participants.find(p => p.identity === participantIdentity);

        if (!target) {
            return res.status(404).json({ success: false, error: 'Participant not found in room' });
        }

        let stopped = false;
        for (const track of target.tracks) {
            // Screen share source = 3 (SCREEN_SHARE) or 4 (SCREEN_SHARE_AUDIO)
            if (track.source === 3 || track.source === 4) {
                await roomService.mutePublishedTrack(roomId, participantIdentity, track.sid, true);
                stopped = true;
            }
        }

        console.log(`[Host Control] Stop Screen Share for ${participantIdentity} in room ${roomId}. Found active: ${stopped}`);

        res.json({
            success: true,
            data: {
                message: stopped ? 'Screen share stopped' : 'No active screen share found',
                stopped
            }
        });

    } catch (error) {
        console.error(`[Host Control Error] Stop Screen Share failed for ${participantIdentity} in ${roomId}:`, error.message);
        next(error);
    }
};
