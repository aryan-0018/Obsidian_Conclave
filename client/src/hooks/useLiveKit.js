import { useCallback, useState } from "react";
import { fetchLivekitToken } from "../service/livekit";


/**
 * useLiveKit hook
 *
 * Manages fetching a LiveKit token from the backend.
 * The actual room connection is handled declaratively by
 * <LiveKitRoom> from @livekit/components-react.
 */
export const useLiveKit = () => {
    const [livekitToken, setLivekitToken] = useState(null);
    const [livekitUrl, setLivekitUrl] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    /**
     * Fetch a token for the given room.
     * Call this after the session API confirms the user should join.
     */
    const connectToRoom = useCallback(async (roomId) => {
        if (!roomId) {
            const errorMessage = "Room ID is required";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }

        setLoading(true);
        setError(null);

        try {
            const { token, url } = await fetchLivekitToken(roomId);
            setLivekitToken(token);
            setLivekitUrl(url);
            return { success: true, token, url };
        } catch (err) {
            const errorMessage = err.message || "Failed to connect to video room";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Reset state when leaving a room.
     */
    const disconnectFromRoom = useCallback(() => {
        setLivekitToken(null);
        setLivekitUrl(null);
        setIsConnected(false);
        setError(null);
    }, []);

    const onConnected = useCallback(() => {
        setIsConnected(true);
    }, []);

    const onDisconnected = useCallback(() => {
        setIsConnected(false);
    }, []);

    return {
        // State
        livekitToken,
        livekitUrl,
        error,
        loading,
        isConnected,

        // Methods
        connectToRoom,
        disconnectFromRoom,
        onConnected,
        onDisconnected,
    };
};
