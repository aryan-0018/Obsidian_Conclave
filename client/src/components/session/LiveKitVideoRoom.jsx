import React from "react";
import {
    LiveKitRoom,
    VideoConference,
    RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import {
    FaExclamationCircle,
    FaSpinner,
    FaVideo,
} from "react-icons/fa";
import { APP_CONFIG } from "../../utils/constants";

const LiveKitVideoRoom = ({
    token,
    serverUrl,
    isConnected,
    error,
    loading,
    onConnected,
    onDisconnected,
    onLeave,
    leaveButtonText,
}) => {
    // If no token yet, show loading or error state
    if (!token || !serverUrl) {
        return (
            <div className="bg-obsidian-card rounded-xl shadow-lg border p-6 border-obsidian-border">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-obsidian-text flex items-center">
                        <FaVideo className="w-5 h-5 mr-3 text-obsidian-gold" />
                        {APP_CONFIG.SESSION_CONTENT.VIDEO.TITLE}
                    </h2>
                </div>

                {error && (
                    <div className="mb-4 bg-obsidian-secondary/50 border-l-4 border-destructive text-destructive p-4 rounded-lg">
                        <div className="flex items-center">
                            <FaExclamationCircle className="w-5 h-5 mr-2" />
                            <span className="text-sm">{error}</span>
                        </div>
                    </div>
                )}

                <div className="w-full h-[calc(100vh-300px)] rounded-xl overflow-hidden bg-black border border-obsidian-border shadow-inner flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-obsidian-gold/5 filter blur-[100px] pointer-events-none"></div>
                    {loading ? (
                        <div className="text-center relative z-10">
                            <FaSpinner className="animate-spin h-8 w-8 text-obsidian-gold mx-auto mb-3" />
                            <p className="text-obsidian-muted font-medium">
                                {APP_CONFIG.SESSION_CONTENT.VIDEO.CONNECTING}
                            </p>
                        </div>
                    ) : (
                        <p className="text-obsidian-muted/80 relative z-10 font-medium tracking-wide">Waiting to connect...</p>
                    )}
                </div>

                {onLeave && (
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={onLeave}
                            className="px-8 py-3 font-bold text-obsidian-text bg-destructive rounded-lg hover:bg-red-800 transition-all border border-red-900 shadow-[0_0_10px_rgba(255,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-obsidian-bg focus:ring-destructive transform hover:scale-105"
                        >
                            {leaveButtonText ||
                                APP_CONFIG.SESSION_CONTENT.VIDEO.LEAVE_BUTTON}
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-obsidian-card rounded-xl shadow-lg border p-6 border-obsidian-border">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-obsidian-border">
                <h2 className="text-xl font-bold text-obsidian-text flex items-center">
                    <FaVideo className="w-5 h-5 mr-3 text-obsidian-gold" />
                    {APP_CONFIG.SESSION_CONTENT.VIDEO.TITLE}
                </h2>
                <div className="flex items-center space-x-3">
                    {isConnected && (
                        <span className="flex items-center text-sm text-green-600 font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                            {APP_CONFIG.SESSION_CONTENT.VIDEO.CONNECTED}
                        </span>
                    )}
                </div>
            </div>

            {error && (
                <div className="mb-4 bg-obsidian-secondary/50 border-l-4 border-destructive text-destructive p-4 rounded-lg mt-4">
                    <div className="flex items-center">
                        <FaExclamationCircle className="w-5 h-5 mr-2" />
                        <span className="text-sm">{error}</span>
                    </div>
                </div>
            )}

            <div
                className="w-full rounded-xl overflow-hidden border border-obsidian-border shadow-inner mt-4 bg-black relative"
                style={{ height: "calc(100vh - 300px)" }}
                data-lk-theme="default"
            >
                <LiveKitRoom
                    serverUrl={serverUrl}
                    token={token}
                    connect={true}
                    video={true}
                    audio={true}
                    onConnected={onConnected}
                    onDisconnected={onDisconnected}
                    style={{ height: "100%" }}
                >
                    <VideoConference />
                    <RoomAudioRenderer />
                </LiveKitRoom>
            </div>

            {onLeave && (
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={onLeave}
                        className="px-8 py-3 font-bold text-obsidian-text bg-destructive rounded-lg hover:bg-red-800 transition-all border border-red-900 shadow-[0_0_10px_rgba(255,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-obsidian-bg focus:ring-destructive transform hover:scale-105"
                    >
                        {leaveButtonText ||
                            APP_CONFIG.SESSION_CONTENT.VIDEO.LEAVE_BUTTON}
                    </button>
                </div>
            )}
        </div>
    );
};

export default LiveKitVideoRoom;
