import React from 'react';
import { FaSpinner, FaClock, FaTimesCircle } from 'react-icons/fa';
import { APP_CONFIG } from '../../utils/constants';

const WaitingRoom = ({ roomId, hostName, onLeave, denied, sessionEnded }) => {
    if (sessionEnded) {
        return (
            <div className="max-w-lg mx-auto">
                <div className="bg-obsidian-card rounded-2xl shadow-lg p-8 sm:p-10 border border-obsidian-border text-center">
                    <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
                        <FaTimesCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-obsidian-text mb-3">
                        Session Ended
                    </h2>
                    <p className="text-obsidian-muted mb-6">
                        {APP_CONFIG.SESSION_CONTENT.WAITING_ROOM.SESSION_ENDED_MESSAGE}
                    </p>
                    <button
                        onClick={onLeave}
                        className="px-6 py-3 bg-obsidian-gold text-obsidian-bg rounded-lg font-bold hover:bg-obsidian-goldHover transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (denied) {
        return (
            <div className="max-w-lg mx-auto">
                <div className="bg-obsidian-card rounded-2xl shadow-lg p-8 sm:p-10 border border-obsidian-border text-center">
                    <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
                        <FaTimesCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-obsidian-text mb-3">
                        Request Denied
                    </h2>
                    <p className="text-obsidian-muted mb-6">
                        {APP_CONFIG.SESSION_CONTENT.WAITING_ROOM.DENIED_MESSAGE}
                    </p>
                    <button
                        onClick={onLeave}
                        className="px-6 py-3 bg-obsidian-gold text-obsidian-bg rounded-lg font-bold hover:bg-obsidian-goldHover transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto">
            <div className="bg-obsidian-card rounded-2xl shadow-lg p-8 sm:p-10 border border-obsidian-border text-center">
                {/* Animated waiting icon */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 bg-obsidian-gold/20 rounded-full animate-ping"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-obsidian-gold/20 to-obsidian-goldHover/10 border border-obsidian-gold/30 rounded-full flex items-center justify-center">
                        <FaClock className="w-8 h-8 text-obsidian-gold" />
                    </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-obsidian-text mb-3">
                    {APP_CONFIG.SESSION_CONTENT.WAITING_ROOM.HEADING}
                </h2>
                <p className="text-obsidian-muted mb-2">
                    {APP_CONFIG.SESSION_CONTENT.WAITING_ROOM.DESCRIPTION}
                </p>

                {hostName && (
                    <p className="text-sm text-obsidian-muted mb-6">
                        Host: <span className="text-obsidian-gold font-semibold">{hostName}</span>
                    </p>
                )}

                {/* Loading dots */}
                <div className="flex items-center justify-center space-x-2 mb-6">
                    <FaSpinner className="animate-spin h-5 w-5 text-obsidian-gold" />
                    <span className="text-sm text-obsidian-muted">Waiting...</span>
                </div>

                {roomId && (
                    <div className="bg-obsidian-secondary rounded-lg px-4 py-3 border border-obsidian-border mb-6">
                        <p className="text-xs text-obsidian-muted mb-1">Room ID</p>
                        <p className="text-obsidian-gold font-mono font-bold tracking-wider">{roomId}</p>
                    </div>
                )}

                <button
                    onClick={onLeave}
                    className="px-6 py-2.5 text-sm font-bold text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                    Cancel & Leave
                </button>
            </div>
        </div>
    );
};

export default WaitingRoom;
