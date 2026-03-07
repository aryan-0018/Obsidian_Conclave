import { AccessToken } from 'livekit-server-sdk';
import User from '../model/User.js';


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
