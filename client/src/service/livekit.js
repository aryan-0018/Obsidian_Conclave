import api from './api';
import { API_ENDPOINTS } from '../utils/constants';


/**
 * Fetch a LiveKit access token from the backend.
 * The API key and secret never leave the server.
 *
 * @param {string} roomId - The room to join
 * @returns {Promise<{token: string, url: string}>}
 */
export const fetchLivekitToken = async (roomId) => {
    try {
        const response = await api.post(API_ENDPOINTS.SESSION.LIVEKIT_TOKEN, { roomId });

        if (!response.data?.success || !response.data?.data?.token) {
            throw new Error('Server returned an invalid token response');
        }

        return {
            token: response.data.data.token,
            url: response.data.data.url,
        };
    } catch (error) {
        const serverMessage = error.response?.data?.error || error.message;
        throw new Error(`Failed to get video token: ${serverMessage}`);
    }
};
