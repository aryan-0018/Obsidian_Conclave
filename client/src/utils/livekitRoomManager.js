// LiveKit Room Manager Singleton
// Keeps track of the active LiveKit room instance across the app
// to enable Discord-style per-user volume controls (0% - 200%), deafening, and track tuning.

let activeRoom = null;
const listeners = new Set();

export const registerActiveRoom = (room) => {
    activeRoom = room;
    listeners.forEach((fn) => {
        try {
            fn(activeRoom);
        } catch (e) {
            console.error("Room listener error:", e);
        }
    });
};

export const unregisterActiveRoom = () => {
    activeRoom = null;
    listeners.forEach((fn) => {
        try {
            fn(null);
        } catch (e) {
            console.error("Room listener error:", e);
        }
    });
};

export const getActiveRoom = () => activeRoom;

export const subscribeActiveRoom = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

/**
 * Sets the audio volume of a remote participant in the active LiveKit room.
 * @param {string} identityOrSid - The participant identity or SID.
 * @param {number} volumeMultiplier - Multiplier between 0.0 (mute) and 2.0 (200% boost).
 */
export const setRemoteParticipantVolume = (identityOrSid, volumeMultiplier) => {
    if (!activeRoom) return false;
    let found = false;
    const targetStr = identityOrSid?.toString();
    for (const [sid, participant] of activeRoom.remoteParticipants) {
        if (participant.identity?.toString() === targetStr || sid?.toString() === targetStr) {
            if (typeof participant.setVolume === "function") {
                participant.setVolume(volumeMultiplier);
                found = true;
            }
        }
    }
    return found;
};
