import React from 'react';
import { FaClock, FaCheck, FaTimes, FaUserClock } from 'react-icons/fa';
import { APP_CONFIG } from '../../utils/constants';

const PendingParticipants = ({ pendingParticipants, onAdmit, onDeny, roomId }) => {
    if (!pendingParticipants || pendingParticipants.length === 0) {
        return null;
    }

    return (
        <div className="bg-obsidian-card rounded-xl shadow-lg p-4 sm:p-6 border border-obsidian-gold/20">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-obsidian-border">
                <div className="flex items-center">
                    <FaUserClock className="w-5 h-5 mr-3 text-yellow-400" />
                    <h2 className="text-lg font-bold text-obsidian-text">
                        {APP_CONFIG.SESSION_CONTENT.PENDING.HEADING}
                    </h2>
                </div>
                <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2.5 py-1 rounded-full border border-yellow-500/30">
                    {pendingParticipants.length}
                </span>
            </div>

            <div className="space-y-2">
                {pendingParticipants.map((p) => (
                    <div
                        key={p.userId || p.userName}
                        className="flex items-center justify-between p-3 bg-obsidian-secondary/70 rounded-lg border border-obsidian-border hover:border-obsidian-gold/20 transition-colors"
                    >
                        <div className="flex items-center min-w-0 flex-1">
                            <div className="w-8 h-8 bg-yellow-500/20 border border-yellow-500/30 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                <span className="text-yellow-400 text-sm font-bold">
                                    {p.userName?.charAt(0)?.toUpperCase()}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-obsidian-text text-sm truncate">
                                    {p.userName}
                                </p>
                                <p className="text-xs text-obsidian-muted flex items-center gap-1">
                                    <FaClock className="w-2.5 h-2.5" />
                                    Waiting...
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                            <button
                                onClick={() => onAdmit(roomId, p.userId)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-colors"
                            >
                                <FaCheck className="w-2.5 h-2.5" />
                                {APP_CONFIG.SESSION_CONTENT.PENDING.ADMIT_BUTTON}
                            </button>
                            <button
                                onClick={() => onDeny(roomId, p.userId)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors"
                            >
                                <FaTimes className="w-2.5 h-2.5" />
                                {APP_CONFIG.SESSION_CONTENT.PENDING.DENY_BUTTON}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PendingParticipants;
