import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { getDuration } from "../../utils/helpers";
import {
    LiveKitRoom,
    VideoConference,
    RoomAudioRenderer,
    ControlBar,
    RoomContext,
    useParticipants
} from "@livekit/components-react";
import "@livekit/components-styles";
import {
    FaExclamationCircle,
    FaSpinner,
    FaVideo,
    FaExpand,
    FaCompress,
    FaCircle,
    FaRegStopCircle,
    FaClock,
    FaUsers,
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
    startedAt,
    participantsPanel,
    participantCount,
    onParticipantsUpdate,
}) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [showParticipantsPanel, setShowParticipantsPanel] = useState(false);
    const [elapsedTime, setElapsedTime] = useState("0s");
    const [isRecording, setIsRecording] = useState(false);
    const containerRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const [controlBarElem, setControlBarElem] = useState(null);

    const toggleFullscreen = useCallback(() => {
        setIsFullscreen((prev) => {
            const next = !prev;
            if (next) {
                setShowHint(true);
                setTimeout(() => setShowHint(false), 3500);
            } else {
                setShowParticipantsPanel(false); // Close panel when exiting fullscreen
            }
            return next;
        });
    }, []);

    // Escape key listener for fullscreen exit
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isFullscreen) {
                setIsFullscreen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isFullscreen]);

    // Mutually exclusive sidebars (Chat vs Participants)
    useEffect(() => {
        if (!isFullscreen) return;

        const handleChatToggleClick = (e) => {
            const toggle = e.target.closest('.lk-chat-toggle');
            // Sometimes the button itself is the target, sometimes an SVG inside it
            if (toggle) {
                // If the chat is about to open (aria-pressed is false or missing)
                if (toggle.getAttribute('aria-pressed') !== 'true') {
                    setShowParticipantsPanel(false); // Hide the participants panel
                }
            }
        };

        // Use capture phase to ensure we catch it before LiveKit handles it
        document.addEventListener('click', handleChatToggleClick, true);
        return () => document.removeEventListener('click', handleChatToggleClick, true);
    }, [isFullscreen]);

    const handleToggleParticipants = () => {
        const nextState = !showParticipantsPanel;
        setShowParticipantsPanel(nextState);

        if (nextState) {
            // If we are opening participants, definitively close the Chat panel if it's active
            const activeChatToggle = document.querySelector('.lk-chat-toggle[aria-pressed="true"]');
            if (activeChatToggle) {
                activeChatToggle.click();
            }
        }
    };

    // Lock body scroll in fullscreen
    useEffect(() => {
        if (isFullscreen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isFullscreen]);

    // Track the LiveKit control bar to portal the explicit Leave button
    useEffect(() => {
        if (!isConnected) return;

        const monitorInterval = setInterval(() => {
            if (containerRef.current) {
                const bar = containerRef.current.querySelector(".lk-control-bar");
                if (bar && !controlBarElem) {
                    setControlBarElem(bar);
                    clearInterval(monitorInterval);
                }
            }
        }, 500);

        return () => clearInterval(monitorInterval);
    }, [isConnected, controlBarElem]);

    // Timer logic
    useEffect(() => {
        if (!startedAt || !isConnected) return;
        const interval = setInterval(() => {
            setElapsedTime(getDuration(startedAt, new Date()));
        }, 1000);
        return () => clearInterval(interval);
    }, [startedAt, isConnected]);

    // Recording logic
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { displaySurface: "browser" },
                audio: true,
                preferCurrentTab: true,
            });

            const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "video/webm" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `Obsidian_Conclave_Recording_${new Date().getTime()}.webm`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                // Stop all tracks
                stream.getTracks().forEach((track) => track.stop());
                setIsRecording(false);
            };

            // Listen for native stream stop (e.g. user clicks "Stop sharing" in browser UI)
            stream.getVideoTracks()[0].onended = () => {
                if (mediaRecorder.state !== "inactive") {
                    mediaRecorder.stop();
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error starting screen recording:", err);
            // Ignore AbortError (user cancelled)
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
    };

    // Auto-stop recording on unmount or session leave
    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

    // If no token yet, show loading or error state
    if (!token || !serverUrl) {
        return (
            <div className="bg-obsidian-card rounded-xl shadow-lg border p-4 sm:p-6 border-obsidian-border">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-obsidian-text flex items-center">
                        <FaVideo className="w-5 h-5 mr-3 text-obsidian-gold flex-shrink-0" />
                        {APP_CONFIG.SESSION_CONTENT.VIDEO.TITLE}
                    </h2>
                </div>

                {error && (
                    <div className="mb-4 bg-obsidian-secondary/50 border-l-4 border-destructive text-destructive p-3 sm:p-4 rounded-lg">
                        <div className="flex items-center">
                            <FaExclamationCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    </div>
                )}

                <div className="w-full min-h-[250px] h-[50vh] md:h-[calc(100vh-300px)] rounded-xl overflow-hidden bg-black border border-obsidian-border shadow-inner flex items-center justify-center relative">
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
                    <div className="mt-4 sm:mt-6 flex justify-center">
                        <button
                            onClick={onLeave}
                            className="px-6 sm:px-8 py-3 font-bold text-obsidian-text bg-destructive rounded-lg hover:bg-red-800 transition-all border border-red-900 shadow-[0_0_10px_rgba(255,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-obsidian-bg focus:ring-destructive transform hover:scale-105"
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
        <div
            ref={containerRef}
            className={`bg-obsidian-card rounded-xl shadow-lg border border-obsidian-border transition-all duration-300 relative ${isFullscreen ? "session-fullscreen" : "p-3 sm:p-6"
                }`}
        >
            {/* Header with fullscreen toggle */}
            {!isFullscreen && (
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-obsidian-border gap-4">
                    <h2 className="text-lg sm:text-xl font-bold text-obsidian-text flex items-center min-w-0">
                        <FaVideo className="w-5 h-5 mr-3 text-obsidian-gold flex-shrink-0" />
                        <span className="truncate">{APP_CONFIG.SESSION_CONTENT.VIDEO.TITLE}</span>
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {isConnected && (
                            <span className="flex items-center text-sm text-green-600 font-medium whitespace-nowrap bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                <span>{APP_CONFIG.SESSION_CONTENT.VIDEO.CONNECTED}</span>
                            </span>
                        )}

                        {isConnected && startedAt && (
                            <div className="flex items-center text-sm text-obsidian-muted font-mono bg-obsidian-secondary/50 px-2.5 py-1 rounded border border-obsidian-border flex-shrink-0">
                                <FaClock className="w-3.5 h-3.5 mr-2 text-obsidian-gold" />
                                {elapsedTime}
                            </div>
                        )}

                        {isConnected && (
                            <button
                                onClick={isRecording ? stopRecording : startRecording}
                                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors ${isRecording
                                    ? "bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20"
                                    : "bg-obsidian-secondary text-obsidian-text border-obsidian-border hover:bg-obsidian-card hover:border-obsidian-gold/50"
                                    }`}
                            >
                                {isRecording ? (
                                    <>
                                        <FaRegStopCircle className="w-4 h-4 animate-pulse" />
                                        <span className="hidden sm:inline">{APP_CONFIG.SESSION_CONTENT.VIDEO.STOP_RECORDING}</span>
                                        <span className="sm:hidden text-[10px]">Stop</span>
                                    </>
                                ) : (
                                    <>
                                        <FaCircle className="w-3.5 h-3.5 text-red-500" />
                                        <span className="hidden sm:inline">{APP_CONFIG.SESSION_CONTENT.VIDEO.START_RECORDING}</span>
                                        <span className="sm:hidden text-[10px]">Rec</span>
                                    </>
                                )}
                            </button>
                        )}

                        <button
                            onClick={toggleFullscreen}
                            className="p-2 rounded-lg transition-all focus:outline-none text-obsidian-muted hover:text-obsidian-gold hover:bg-obsidian-secondary"
                            title="Enter fullscreen"
                            aria-label="Enter fullscreen"
                        >
                            <FaExpand className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Fullscreen: overlays (exit button, timer, recording, participants) fixed strictly at top-left to avoid right-side chat overlap */}
            {isFullscreen && (
                <div className="fixed top-3 left-3 right-3 sm:right-auto z-[10001] flex flex-wrap items-center gap-2 sm:gap-3 bg-black/50 backdrop-blur-sm p-1.5 rounded-xl border border-white/5 shadow-lg max-w-[calc(100vw-24px)] pointer-events-auto">
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-all focus:outline-none flex-shrink-0"
                        title="Exit fullscreen"
                        aria-label="Exit fullscreen (Esc)"
                    >
                        <FaCompress className="w-4 h-4" />
                    </button>
                    {isConnected && startedAt && (
                        <div className="flex items-center text-sm text-obsidian-muted font-mono bg-obsidian-secondary/50 px-2.5 py-1 rounded border border-obsidian-border flex-shrink-0">
                            <FaClock className="w-3.5 h-3.5 mr-2 text-obsidian-gold" />
                            {elapsedTime}
                        </div>
                    )}
                    {isConnected && (
                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors flex-shrink-0 ${isRecording
                                ? "bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30"
                                : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            {isRecording ? (
                                <>
                                    <FaRegStopCircle className="w-4 h-4 animate-pulse" />
                                    <span>{APP_CONFIG.SESSION_CONTENT.VIDEO.STOP_RECORDING}</span>
                                </>
                            ) : (
                                <>
                                    <FaCircle className="w-3.5 h-3.5 text-red-500" />
                                    <span className="hidden sm:inline">{APP_CONFIG.SESSION_CONTENT.VIDEO.START_RECORDING}</span>
                                </>
                            )}
                        </button>
                    )}
                    {participantsPanel && (
                        <button
                            onClick={handleToggleParticipants}
                            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors shadow-lg flex-shrink-0 ${showParticipantsPanel
                                ? "bg-obsidian-gold text-obsidian-bg border-obsidian-gold"
                                : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:text-white"
                                }`}
                            title="Toggle Participants Panel"
                            aria-label="Toggle Participants Panel"
                            aria-expanded={showParticipantsPanel}
                        >
                            <FaUsers className="w-4 h-4" />
                            <span className="hidden sm:inline">Participants</span>
                            {participantCount > 0 && (
                                <span className={`px-1.5 py-0.5 rounded-full text-xs ${showParticipantsPanel ? "bg-obsidian-bg/20" : "bg-white/10"}`}>
                                    {participantCount}
                                </span>
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* Fullscreen exit hint */}
            {isFullscreen && showHint && (
                <div className="fullscreen-exit-hint fullscreen-hint-animate">
                    Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs font-mono border border-white/20">Esc</kbd> to exit fullscreen
                </div>
            )}

            {error && !isFullscreen && (
                <div className="mb-4 bg-obsidian-secondary/50 border-l-4 border-destructive text-destructive p-3 sm:p-4 rounded-lg mt-4">
                    <div className="flex items-center">
                        <FaExclamationCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                        <span className="text-sm">{error}</span>
                    </div>
                </div>
            )}

            <div
                className={`w-full flex flex-row rounded-xl overflow-hidden border border-obsidian-border shadow-inner bg-black relative ${isFullscreen ? "!border-none !rounded-none" : "mt-4"
                    }`}
                style={{
                    height: isFullscreen ? "100vh" : undefined,
                    minHeight: isFullscreen ? undefined : "250px",
                }}
                data-lk-theme="default"
            >
                {/* Responsive height via CSS classes when not fullscreen */}
                {!isFullscreen && (
                    <style>{`
                        [data-lk-theme="default"]:not(.session-fullscreen [data-lk-theme="default"]) {
                            height: 50vh;
                        }
                        @media (min-width: 768px) {
                            [data-lk-theme="default"]:not(.session-fullscreen [data-lk-theme="default"]) {
                                height: calc(100vh - 280px);
                            }
                        }
                    `}</style>
                )}

                <div className="flex-1 relative h-full min-w-0">
                    <LiveKitRoom
                        serverUrl={serverUrl}
                        token={token}
                        connect={true}
                        video={true}
                        audio={true}
                        onConnected={onConnected}
                        onDisconnected={() => {
                            if (isFullscreen) setIsFullscreen(false);
                            stopRecording();
                            if (onDisconnected) onDisconnected();
                            // Automatically trigger leave behavior if they disconnect via the LiveKit bar
                            if (onLeave) onLeave();
                        }}
                        style={{ height: "100%" }}
                    >
                        <VideoRoomInner
                            isFullscreen={isFullscreen}
                            showHint={showHint}
                            isConnected={isConnected}
                            startedAt={startedAt}
                            elapsedTime={elapsedTime}
                            isRecording={isRecording}
                            startRecording={startRecording}
                            stopRecording={stopRecording}
                            toggleFullscreen={toggleFullscreen}
                            showParticipantsPanel={showParticipantsPanel}
                            handleToggleParticipants={handleToggleParticipants}
                            participantsPanel={participantsPanel}
                            onLeave={onLeave}
                            leaveButtonText={leaveButtonText}
                            controlBarElem={controlBarElem}
                            onParticipantsUpdate={onParticipantsUpdate}
                        />
                    </LiveKitRoom>
                </div>

                {/* Fullscreen Participants Slide-out Panel - Enhanced for Mobile Overlay */}
                {isFullscreen && showParticipantsPanel && participantsPanel && (
                    <div className="fixed inset-y-0 right-0 w-full sm:w-80 md:w-96 bg-obsidian-bg border-l border-obsidian-border z-[10005] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-fade-in-right overflow-y-auto pointer-events-auto">
                        <div className="p-0 flex-1 relative">
                            {/* Close button for mobile accessibility */}
                            <button
                                onClick={() => setShowParticipantsPanel(false)}
                                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors z-[10] sm:hidden"
                                aria-label="Close Participants List"
                            >
                                <FaCompress className="w-5 h-5 rotate-45" />
                            </button>
                            <div className="p-4 pt-12 sm:pt-4 h-full">
                                {participantsPanel}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Inner component to safely use LiveKit hooks within the Room Context
const VideoRoomInner = ({
    isFullscreen,
    isConnected,
    startedAt,
    elapsedTime,
    isRecording,
    startRecording,
    stopRecording,
    toggleFullscreen,
    showParticipantsPanel,
    handleToggleParticipants,
    participantsPanel,
    onLeave,
    leaveButtonText,
    controlBarElem,
    onParticipantsUpdate
}) => {
    // Get real-time WebRTC participants directly from the Room
    const participants = useParticipants();
    // Exclude the completely hidden/technical "local" participant if necessary, but LiveKit usually handles this.
    const realTimeCount = participants.length;

    // Push real-time participants up to parent so external components can sync instantly
    useEffect(() => {
        if (onParticipantsUpdate) {
            onParticipantsUpdate(participants);
        }
    }, [participants, onParticipantsUpdate]);

    return (
        <>
            <VideoConference />
            <RoomAudioRenderer />

            {/* Fullscreen Overlay Controls */}
            {isFullscreen && (
                <div className="fixed top-3 left-3 right-3 sm:right-auto z-[10001] flex flex-wrap items-center gap-2 sm:gap-3 bg-black/50 backdrop-blur-sm p-1.5 rounded-xl border border-white/5 shadow-lg max-w-[calc(100vw-24px)] pointer-events-auto">
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-all focus:outline-none flex-shrink-0"
                        title="Exit fullscreen"
                        aria-label="Exit fullscreen (Esc)"
                    >
                        <FaCompress className="w-4 h-4" />
                    </button>
                    {isConnected && startedAt && (
                        <div className="flex items-center text-sm text-obsidian-muted font-mono bg-obsidian-secondary/50 px-2.5 py-1 rounded border border-obsidian-border flex-shrink-0">
                            <FaClock className="w-3.5 h-3.5 mr-2 text-obsidian-gold" />
                            {elapsedTime}
                        </div>
                    )}
                    {isConnected && (
                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors flex-shrink-0 ${isRecording
                                ? "bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30"
                                : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            {isRecording ? (
                                <>
                                    <FaRegStopCircle className="w-4 h-4 animate-pulse" />
                                    <span>{APP_CONFIG.SESSION_CONTENT.VIDEO.STOP_RECORDING}</span>
                                </>
                            ) : (
                                <>
                                    <FaCircle className="w-3.5 h-3.5 text-red-500" />
                                    <span className="hidden sm:inline">{APP_CONFIG.SESSION_CONTENT.VIDEO.START_RECORDING}</span>
                                </>
                            )}
                        </button>
                    )}
                    {participantsPanel && (
                        <button
                            onClick={handleToggleParticipants}
                            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors shadow-lg flex-shrink-0 ${showParticipantsPanel
                                ? "bg-obsidian-gold text-obsidian-bg border-obsidian-gold"
                                : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:text-white"
                                }`}
                            title="Toggle Participants Panel"
                            aria-label="Toggle Participants Panel"
                            aria-expanded={showParticipantsPanel}
                        >
                            <FaUsers className="w-4 h-4" />
                            <span className="hidden sm:inline">Participants</span>
                            {realTimeCount > 0 && (
                                <span className={`px-1.5 py-0.5 rounded-full text-xs ${showParticipantsPanel ? "bg-obsidian-bg/20" : "bg-white/10"}`}>
                                    {realTimeCount}
                                </span>
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* Custom Portal to inject Leave Button flawlessly into LiveKit Control Bar */}
            {onLeave && controlBarElem && createPortal(
                <button
                    onClick={onLeave}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-[12px] sm:text-sm font-bold !text-white !bg-red-600 rounded-lg hover:!bg-red-700 transition-colors border border-red-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-obsidian-bg focus:ring-red-500 flex items-center justify-center flex-shrink-0 ml-2"
                >
                    {leaveButtonText || APP_CONFIG.SESSION_CONTENT.VIDEO.LEAVE_BUTTON}
                </button>,
                controlBarElem
            )}
        </>
    );
};

export default LiveKitVideoRoom;
