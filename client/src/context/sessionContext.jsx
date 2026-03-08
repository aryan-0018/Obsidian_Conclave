import { createContext, useCallback, useContext, useState } from "react";
import api from "../service/api";
import { API_ENDPOINTS } from "../utils/constants";



const SessionContext = createContext();


export const SessionProvider = ({ children }) => {
    const [currentSession, setCurrentSession] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    //Create a new session
    const createSession = useCallback(async (meetingType = 'public') => {
        try {
            setError(null);
            setLoading(true);
            const response = await api.post(API_ENDPOINTS.SESSION.CREATE, { meetingType });
            const session = response.data.data.session;

            setCurrentSession(session);
            return { success: true, session };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to create new session';
            setError(errorMessage);
            return { success: false, error: errorMessage }
        } finally {
            setLoading(false)
        }
    }, []);

    //join session
    const joinSession = useCallback(async (roomId) => {
        try {
            setError(null);
            setLoading(true);
            const response = await api.post(API_ENDPOINTS.SESSION.JOIN, { roomId });
            const session = response.data.data.session;

            setCurrentSession(session);
            return { success: true, session };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to join session';
            setError(errorMessage);
            return { success: false, error: errorMessage }
        } finally {
            setLoading(false)
        }
    }, [])


    //get session

    const getSession = useCallback(async (roomId) => {
        try {
            setError(null);
            setLoading(true);
            const response = await api.get(`${API_ENDPOINTS.SESSION.GET}/${roomId}`);
            const session = response.data.data.session;

            setCurrentSession(session);
            return { success: true, session };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to get session';
            setError(errorMessage);
            return { success: false, error: errorMessage }
        } finally {
            setLoading(false)
        }
    }, [])


    //leave session

    const leaveSession = useCallback(async (roomId) => {
        try {
            setError(null);
            setLoading(true);
            await api.post(API_ENDPOINTS.SESSION.LEAVE, { roomId });

            setCurrentSession(null);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to leave session';
            setError(errorMessage);
            return { success: false, error: errorMessage }
        } finally {
            setLoading(false)
        }
    }, [])


    //list sessions

    const listSessions = useCallback(async (status = 'all') => {
        try {
            setError(null);
            setLoading(true);
            const response = await api.get(API_ENDPOINTS.SESSION.LIST, {
                params: { status }
            });
            const sessions = response.data.data.session;
            return { success: true, sessions };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to fetch sessions';
            setError(errorMessage);
            return { success: false, error: errorMessage }
        } finally {
            setLoading(false)
        }
    }, [])


    // ========================================
    // Waiting Room: Admit / Deny
    // ========================================

    const admitParticipant = useCallback(async (roomId, pendingUserId) => {
        try {
            const response = await api.post(API_ENDPOINTS.SESSION.ADMIT, { roomId, pendingUserId });
            return { success: true, data: response.data.data };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to admit participant';
            return { success: false, error: errorMessage };
        }
    }, []);

    const denyParticipant = useCallback(async (roomId, pendingUserId) => {
        try {
            const response = await api.post(API_ENDPOINTS.SESSION.DENY, { roomId, pendingUserId });
            return { success: true, data: response.data.data };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to deny participant';
            return { success: false, error: errorMessage };
        }
    }, []);


    // ========================================
    // Host Controls
    // ========================================

    const removeParticipant = useCallback(async (roomId, targetUserId) => {
        try {
            const response = await api.post(API_ENDPOINTS.SESSION.REMOVE, { roomId, targetUserId });
            return { success: true, data: response.data.data };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to remove participant';
            return { success: false, error: errorMessage };
        }
    }, []);

    const muteParticipant = useCallback(async (roomId, participantIdentity, trackSid, muted = true) => {
        try {
            const response = await api.post(API_ENDPOINTS.SESSION.MUTE, { roomId, participantIdentity, trackSid, muted });
            return { success: true, data: response.data.data };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to mute participant';
            return { success: false, error: errorMessage };
        }
    }, []);

    const stopScreenShare = useCallback(async (roomId, participantIdentity) => {
        try {
            const response = await api.post(API_ENDPOINTS.SESSION.STOP_SCREENSHARE, { roomId, participantIdentity });
            return { success: true, data: response.data.data };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to stop screen share';
            return { success: false, error: errorMessage };
        }
    }, []);


    const clearSession = useCallback(() => {
        setCurrentSession(null);
        setError(null);
    }, [])

    const value = {
        currentSession,
        loading,
        error,
        createSession,
        joinSession,
        getSession,
        leaveSession,
        listSessions,
        clearSession,
        setError,
        // New methods
        admitParticipant,
        denyParticipant,
        removeParticipant,
        muteParticipant,
        stopScreenShare,
    }

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    )
};


export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a session Provider')
    }

    return context;
}



export default SessionContext;