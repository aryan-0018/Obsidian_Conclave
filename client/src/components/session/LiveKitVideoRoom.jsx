import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
    LiveKitRoom,
    RoomAudioRenderer,
    VideoTrack,
    useParticipants,
    useRoomContext,
    useLocalParticipant,
    useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { RoomEvent, Track, VideoQuality, VideoPresets } from "livekit-client";
import {
    FaExclamationCircle,
    FaSpinner,
    FaVideo,
    FaVideoSlash,
    FaMicrophone,
    FaMicrophoneSlash,
    FaHeadphones,
    FaDesktop,
    FaPhoneSlash,
    FaExpand,
    FaCompress,
    FaChevronDown,
    FaChevronUp,
    FaUsers,
    FaBolt,
    FaTimes,
    FaThLarge,
    FaPlay,
} from "react-icons/fa";
import { registerActiveRoom, unregisterActiveRoom } from "../../utils/livekitRoomManager";
import toast from "react-hot-toast";

// ========================================
// Discord Stream Quality Presets
// ========================================
const DISCORD_RESOLUTIONS = [
    { id: "720p", label: "720p", width: 1280, height: 720 },
    { id: "1080p", label: "1080p", width: 1920, height: 1080 },
    { id: "1440p", label: "1440p", width: 2560, height: 1440 },
    { id: "4k", label: "Source (4K)", width: 3840, height: 2160 },
];

const DISCORD_FRAMERATES = [
    { id: "15", label: "15 FPS", fps: 15 },
    { id: "30", label: "30 FPS", fps: 30 },
    { id: "60", label: "60 FPS", fps: 60 },
];

const getBitrate = (resId, fps) => {
    const map = {
        "720p": { 15: 1_500_000, 30: 2_500_000, 60: 4_000_000 },
        "1080p": { 15: 2_500_000, 30: 5_000_000, 60: 7_500_000 },
        "1440p": { 15: 4_500_000, 30: 8_500_000, 60: 12_000_000 },
        "4k": { 15: 7_000_000, 30: 12_000_000, 60: 16_000_000 },
    };
    return map[resId]?.[fps] || 6_000_000;
};

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
    participantsPanel,
    participantCount,
    onParticipantsUpdate,
}) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showParticipantsPanel, setShowParticipantsPanel] = useState(false);
    const [streamResolution, setStreamResolution] = useState("1080p");
    const [streamFramerate, setStreamFramerate] = useState("60");
    const [showQualityModal, setShowQualityModal] = useState(false);
    const containerRef = useRef(null);

    const activeBitrate = useMemo(
        () => getBitrate(streamResolution, Number(streamFramerate)),
        [streamResolution, streamFramerate]
    );

    const activeResolutionObj = useMemo(
        () => DISCORD_RESOLUTIONS.find((r) => r.id === streamResolution) || DISCORD_RESOLUTIONS[1],
        [streamResolution]
    );

    // ========================================
    // LiveKit Stream Optimization
    // ========================================
    const roomOptions = useMemo(
        () => ({
            adaptiveStream: {
                pixelDensity: "screen",
                pauseVideoInBackground: false,
            },
            dynacast: true,
            rtcConfig: {
                iceTransportPolicy: "all",
                bundlePolicy: "max-bundle",
                iceCandidatePoolSize: 10,
            },
            publishDefaults: {
                videoCodec: "vp9",
                screenShareEncoding: {
                    maxBitrate: activeBitrate,
                    maxFramerate: Number(streamFramerate),
                    priority: "high",
                },
                videoEncoding: {
                    maxBitrate: Math.min(activeBitrate, 6_000_000),
                    maxFramerate: Number(streamFramerate),
                    priority: "high",
                },
                videoSimulcastLayers: [
                    VideoPresets.h720,
                    VideoPresets.h1080,
                    VideoPresets.h1440,
                ],
                audioPreset: {
                    maxBitrate: 384_000,
                },
                dtx: false,
                red: true,
            },
            videoCaptureDefaults: {
                resolution: {
                    width: activeResolutionObj.width,
                    height: activeResolutionObj.height,
                    frameRate: Number(streamFramerate),
                },
            },
            screenShareCaptureDefaults: {
                audio: {
                    autoGainControl: false,
                    echoCancellation: false,
                    noiseSuppression: false,
                    channelCount: 2,
                    sampleRate: 48000,
                },
                resolution: {
                    width: activeResolutionObj.width,
                    height: activeResolutionObj.height,
                },
                maxFrameRate: Number(streamFramerate),
                surfaceSwitching: "include",
                systemAudio: "include",
                selfBrowserSurface: "exclude",
            },
            audioCaptureDefaults: {
                autoGainControl: true,
                echoCancellation: true,
                noiseSuppression: true,
                channelCount: 2,
                sampleRate: 48000,
            },
        }),
        [activeBitrate, streamFramerate, activeResolutionObj]
    );

    // ========================================
    // Fullscreen Handling
    // ========================================
    const toggleFullscreen = useCallback(async () => {
        try {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                const elem = containerRef.current || document.documentElement;
                if (elem.requestFullscreen) await elem.requestFullscreen();
                else if (elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen();
                setIsFullscreen(true);
            } else {
                if (document.exitFullscreen) await document.exitFullscreen();
                else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
                setIsFullscreen(false);
                setShowParticipantsPanel(false);
            }
        } catch (err) {
            setIsFullscreen((prev) => !prev);
        }
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            const isNative = !!(document.fullscreenElement || document.webkitFullscreenElement);
            setIsFullscreen(isNative);
            if (!isNative) setShowParticipantsPanel(false);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
        };
    }, []);

    // Keyboard Shortcuts: 'F' fullscreen, 'Esc' exit
    useEffect(() => {
        const handleKeyDown = (e) => {
            const tag = document.activeElement?.tagName?.toLowerCase();
            if (tag === "input" || tag === "textarea" || document.activeElement?.isContentEditable) {
                return;
            }
            if (e.key === "f" || e.key === "F") {
                e.preventDefault();
                toggleFullscreen();
            } else if (e.key === "Escape") {
                if (showQualityModal) setShowQualityModal(false);
                if (isFullscreen) toggleFullscreen();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isFullscreen, toggleFullscreen, showQualityModal]);

    // Loading / Disconnected state
    if (!token || !serverUrl) {
        return (
            <div className="bg-[#1e1f22] rounded-xl border border-white/10 p-6 text-white text-center">
                {error && (
                    <div className="mb-4 bg-red-500/20 border border-red-500/40 text-red-300 p-3 rounded-lg text-sm flex items-center justify-center gap-2">
                        <FaExclamationCircle className="w-4 h-4 text-red-400" />
                        <span>{error}</span>
                    </div>
                )}
                <div className="w-full min-h-[300px] h-[55vh] rounded-xl bg-[#111214] border border-white/10 flex flex-col items-center justify-center">
                    {loading ? (
                        <>
                            <FaSpinner className="animate-spin h-8 w-8 text-obsidian-gold mb-3" />
                            <p className="text-white/60 text-sm font-medium">Connecting to Voice Channel...</p>
                        </>
                    ) : (
                        <p className="text-white/40 text-sm">Ready to connect to session</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`discord-room-container bg-[#111214] text-white flex flex-col relative select-none overflow-hidden transition-all duration-200 ${
                isFullscreen
                    ? "fixed inset-0 z-[99999] w-screen h-screen rounded-none"
                    : "rounded-2xl border border-white/10 w-full h-[76vh] min-h-[540px]"
            }`}
        >
            <div className="h-full flex flex-col flex-1 relative min-h-0 w-full">
                <LiveKitRoom
                    serverUrl={serverUrl}
                    token={token}
                    connect={true}
                    video={true}
                    audio={true}
                    options={roomOptions}
                    onConnected={onConnected}
                    onDisconnected={() => {
                        unregisterActiveRoom();
                        if (onDisconnected) onDisconnected();
                        if (onLeave) onLeave();
                    }}
                    style={{ height: "100%", width: "100%" }}
                >
                    <DiscordVideoRoomInner
                        onLeave={onLeave}
                        isFullscreen={isFullscreen}
                        toggleFullscreen={toggleFullscreen}
                        streamResolution={streamResolution}
                        onOpenQualityModal={() => setShowQualityModal(true)}
                        participantsPanel={participantsPanel}
                        participantCount={participantCount}
                        showParticipantsPanel={showParticipantsPanel}
                        setShowParticipantsPanel={setShowParticipantsPanel}
                        onParticipantsUpdate={onParticipantsUpdate}
                    />
                </LiveKitRoom>
            </div>

            {/* ======================================== */}
            {/* Discord Stream Quality Modal */}
            {/* ======================================== */}
            {showQualityModal && (
                <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in pointer-events-auto">
                    <div className="bg-[#1e1f22] rounded-2xl w-full max-w-md p-6 border border-white/10 shadow-2xl relative text-left text-white">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-obsidian-gold/20 flex items-center justify-center text-obsidian-gold">
                                    <FaBolt className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base">Stream Quality</h3>
                                    <p className="text-xs text-white/50">Select resolution and frame rate</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowQualityModal(false)}
                                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10"
                            >
                                <FaTimes className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Resolution Grid */}
                        <div className="mb-4">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-white/60 mb-2 block">
                                Resolution
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {DISCORD_RESOLUTIONS.map((res) => {
                                    const active = streamResolution === res.id;
                                    return (
                                        <button
                                            key={res.id}
                                            onClick={() => setStreamResolution(res.id)}
                                            className={`py-2.5 px-1 rounded-xl text-center text-xs font-bold transition-all ${
                                                active
                                                    ? "bg-obsidian-gold text-obsidian-bg shadow-md"
                                                    : "bg-[#2b2d31] text-white/80 hover:bg-[#35373c] hover:text-white"
                                            }`}
                                        >
                                            {res.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Frame Rate Grid */}
                        <div className="mb-5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-white/60 mb-2 block">
                                Frame Rate
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {DISCORD_FRAMERATES.map((fr) => {
                                    const active = streamFramerate === fr.id;
                                    return (
                                        <button
                                            key={fr.id}
                                            onClick={() => setStreamFramerate(fr.id)}
                                            className={`py-2.5 px-2 rounded-xl text-center text-xs font-bold transition-all ${
                                                active
                                                    ? "bg-obsidian-gold text-obsidian-bg shadow-md"
                                                    : "bg-[#2b2d31] text-white/80 hover:bg-[#35373c] hover:text-white"
                                            }`}
                                        >
                                            {fr.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Summary Pill */}
                        <div className="bg-[#111214] p-3 rounded-xl border border-white/5 mb-5 flex items-center justify-between text-xs">
                            <span className="text-white/60">Stream Profile:</span>
                            <span className="font-mono font-bold text-obsidian-gold">
                                {streamResolution.toUpperCase()} @ {streamFramerate} FPS
                            </span>
                        </div>

                        <button
                            onClick={() => {
                                setShowQualityModal(false);
                                toast.success(`Stream set to ${streamResolution.toUpperCase()} @ ${streamFramerate} FPS`);
                            }}
                            className="w-full py-2.5 bg-obsidian-gold hover:bg-obsidian-goldHover text-obsidian-bg font-bold text-sm rounded-xl transition-all"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ========================================
// Discord Stream Stage & Grid View Engine
// ========================================
const DiscordVideoRoomInner = ({
    onLeave,
    isFullscreen,
    toggleFullscreen,
    streamResolution,
    onOpenQualityModal,
    participantsPanel,
    participantCount,
    showParticipantsPanel,
    setShowParticipantsPanel,
    onParticipantsUpdate,
}) => {
    const participants = useParticipants();
    const room = useRoomContext();
    const {
        isMicrophoneEnabled,
        isCameraEnabled,
        isScreenShareEnabled,
        localParticipant,
    } = useLocalParticipant();

    const screenTracks = useTracks([Track.Source.ScreenShare]);
    const cameraTracks = useTracks([Track.Source.Camera], { onlySubscribed: false });

    // Stream Selection & Grid Mode State
    const [selectedStreamTrack, setSelectedStreamTrack] = useState(null);
    const [isGridMode, setIsGridMode] = useState(false);
    const prevScreenCountRef = useRef(0);

    // Participant Filmstrip Visibility (when watching focused stream)
    const [showBottomParticipants, setShowBottomParticipants] = useState(true);

    // Discord Voice State
    const [isDeafened, setIsDeafened] = useState(false);
    const prevMicStateRef = useRef(false);
    const isDeafenedRef = useRef(false);

    // 5-second Idle Auto-Hide State
    const [isControlsVisible, setIsControlsVisible] = useState(true);
    const idleTimerRef = useRef(null);

    // Auto-takeover logic:
    // If only 1 person starts streaming and previous count was 0, automatically show that stream only!
    useEffect(() => {
        if (screenTracks.length === 1 && prevScreenCountRef.current === 0) {
            setSelectedStreamTrack(screenTracks[0]);
            setIsGridMode(false);
        } else if (screenTracks.length === 0) {
            setSelectedStreamTrack(null);
            setIsGridMode(false);
        }
        prevScreenCountRef.current = screenTracks.length;
    }, [screenTracks]);

    // Handle track unpublishing/cleanup
    useEffect(() => {
        if (selectedStreamTrack) {
            const exists = screenTracks.some(
                (t) => t.publication?.trackSid === selectedStreamTrack.publication?.trackSid
            );
            if (!exists) {
                if (screenTracks.length > 0) {
                    setSelectedStreamTrack(screenTracks[0]);
                } else {
                    setSelectedStreamTrack(null);
                    setIsGridMode(false);
                }
            }
        }
    }, [screenTracks, selectedStreamTrack]);

    // Active Focused Stream (when not in grid mode)
    const activeFocusedTrack = useMemo(() => {
        if (isGridMode) return null;
        if (selectedStreamTrack) {
            const found = screenTracks.find(
                (t) => t.publication?.trackSid === selectedStreamTrack.publication?.trackSid
            );
            if (found) return found;
        }
        if (screenTracks.length === 1) return screenTracks[0];
        return null;
    }, [isGridMode, selectedStreamTrack, screenTracks]);

    // Idle Timer (5 Seconds)
    const resetIdleTimer = useCallback(() => {
        setIsControlsVisible(true);
        if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
        }
        if (showParticipantsPanel) return;
        idleTimerRef.current = setTimeout(() => {
            setIsControlsVisible(false);
        }, 5000);
    }, [showParticipantsPanel]);

    useEffect(() => {
        resetIdleTimer();
        const handleActivity = () => resetIdleTimer();

        window.addEventListener("mousemove", handleActivity);
        window.addEventListener("keydown", handleActivity);
        window.addEventListener("touchstart", handleActivity);

        return () => {
            if (idleTimerRef.current) {
                clearTimeout(idleTimerRef.current);
            }
            window.removeEventListener("mousemove", handleActivity);
            window.removeEventListener("keydown", handleActivity);
            window.removeEventListener("touchstart", handleActivity);
        };
    }, [resetIdleTimer]);

    const handleDockMouseEnter = () => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        setIsControlsVisible(true);
    };

    const handleDockMouseLeave = () => {
        resetIdleTimer();
    };

    useEffect(() => {
        isDeafenedRef.current = isDeafened;
    }, [isDeafened]);

    // LiveKit Room Manager Singleton
    useEffect(() => {
        if (!room) return;
        registerActiveRoom(room);
        return () => {
            unregisterActiveRoom();
        };
    }, [room]);

    useEffect(() => {
        if (onParticipantsUpdate) {
            onParticipantsUpdate(participants);
        }
    }, [participants, onParticipantsUpdate]);

    // Enforce 60fps 'motion' hint for screen share
    useEffect(() => {
        if (!room) return;
        const handleLocalTrackPublished = (publication) => {
            if (publication.source === Track.Source.ScreenShare && publication.track?.mediaStreamTrack) {
                publication.track.mediaStreamTrack.contentHint = "motion";
            }
        };
        const handleTrackSubscribed = (track, publication) => {
            if (publication.source === Track.Source.ScreenShare) {
                if (typeof publication.setVideoQuality === "function") {
                    publication.setVideoQuality(VideoQuality.HIGH);
                }
                if (track?.mediaStreamTrack) {
                    track.mediaStreamTrack.contentHint = "motion";
                }
            }
        };
        room.on(RoomEvent.LocalTrackPublished, handleLocalTrackPublished);
        room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
        return () => {
            room.off(RoomEvent.LocalTrackPublished, handleLocalTrackPublished);
            room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
        };
    }, [room]);

    // Discord Deafen Logic
    const toggleDeafen = useCallback(async () => {
        if (!room) return;

        if (!isDeafenedRef.current) {
            const wasMicOn = isMicrophoneEnabled;
            prevMicStateRef.current = wasMicOn;

            if (wasMicOn && localParticipant) {
                await localParticipant.setMicrophoneEnabled(false);
            }

            room.remoteParticipants.forEach((p) => {
                if (typeof p.setVolume === "function") {
                    p.setVolume(0);
                }
            });

            setIsDeafened(true);
            toast("Deafened", { icon: "🎧" });
        } else {
            room.remoteParticipants.forEach((p) => {
                if (typeof p.setVolume === "function") {
                    p.setVolume(1.0);
                }
            });

            if (prevMicStateRef.current && localParticipant) {
                await localParticipant.setMicrophoneEnabled(true);
            }

            setIsDeafened(false);
            toast.success("Undeafened");
        }
    }, [room, isMicrophoneEnabled, localParticipant]);

    const toggleMic = useCallback(async () => {
        if (!localParticipant) return;
        if (isDeafenedRef.current) {
            await toggleDeafen();
            return;
        }
        await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
    }, [localParticipant, isMicrophoneEnabled, toggleDeafen]);

    const toggleCamera = useCallback(async () => {
        if (!localParticipant) return;
        await localParticipant.setCameraEnabled(!isCameraEnabled);
    }, [localParticipant, isCameraEnabled]);

    const toggleScreenShare = useCallback(async () => {
        if (!localParticipant) return;
        await localParticipant.setScreenShareEnabled(!isScreenShareEnabled);
    }, [localParticipant, isScreenShareEnabled]);

    // Keyboard Shortcuts (M: Mute, D: Deafen)
    useEffect(() => {
        const handleKeyDown = (e) => {
            const tag = document.activeElement?.tagName?.toLowerCase();
            if (tag === "input" || tag === "textarea" || document.activeElement?.isContentEditable) {
                return;
            }
            if (e.key === "m" || e.key === "M") {
                e.preventDefault();
                toggleMic();
            } else if (e.key === "d" || e.key === "D") {
                e.preventDefault();
                toggleDeafen();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleMic, toggleDeafen]);

    return (
        <div
            className={`h-full w-full flex flex-col relative justify-between overflow-hidden bg-[#111214] ${
                !isControlsVisible ? "cursor-none" : ""
            }`}
            onMouseMove={resetIdleTimer}
            onTouchStart={resetIdleTimer}
        >
            <RoomAudioRenderer />

            {/* ======================================== */}
            {/* MAIN STAGE: FOCUSED STREAM OR GRID VIEW */}
            {/* ======================================== */}
            <div className="flex-1 relative w-full h-full min-h-0 overflow-hidden flex items-center justify-center">
                {activeFocusedTrack ? (
                    /* FOCUSED STREAM: TAKES OVER THE SCREEN */
                    <div
                        className="w-full h-full relative flex items-center justify-center bg-black cursor-pointer select-none"
                        onClick={(e) => {
                            // Clicking on stream toggles to Grid View
                            if (!e.target.closest("button")) {
                                setIsGridMode(true);
                                toast("Switched to Grid View (click stream card to focus again)", { icon: "🔲" });
                            }
                        }}
                        title="Click to switch to Grid View"
                    >
                        <VideoTrack
                            trackRef={activeFocusedTrack}
                            className="w-full h-full object-contain pointer-events-none"
                        />

                        {/* Top-Left Streamer Overlay Badge */}
                        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#1e1f22]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-xs shadow-lg animate-fade-in pointer-events-auto">
                            <span className="font-bold text-white">
                                {activeFocusedTrack.participant?.name || activeFocusedTrack.participant?.identity}'s Screen
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsGridMode(true);
                                }}
                                className="ml-2 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors text-[11px] font-semibold flex items-center gap-1.5"
                                title="Switch to Grid View"
                            >
                                <FaThLarge className="w-3 h-3 text-obsidian-gold" />
                                <span>Grid View</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    /* GRID VIEW: SHOWS PARTICIPANT TILES + SEPARATE STREAM TILES */
                    <div className="w-full h-full p-4 overflow-y-auto grid gap-3.5 items-center justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr max-h-full">
                        {/* 1. SEPARATE CARDS FOR EACH ACTIVE STREAM */}
                        {screenTracks.map((st) => {
                            const streamerName = st.participant?.name || st.participant?.identity || "Participant";
                            return (
                                <div
                                    key={st.publication?.trackSid || `stream-${st.participant?.identity}`}
                                    onClick={() => {
                                        setSelectedStreamTrack(st);
                                        setIsGridMode(false);
                                        toast.success(`Watching ${streamerName}'s stream`);
                                    }}
                                    className="relative rounded-2xl bg-black overflow-hidden flex items-center justify-center aspect-video w-full transition-all duration-200 border border-white/10 hover:border-obsidian-gold shadow-xl cursor-pointer group hover:scale-[1.01]"
                                    title="Click to view stream in full screen"
                                >
                                    <VideoTrack
                                        trackRef={st}
                                        className="w-full h-full object-contain pointer-events-none"
                                    />

                                    {/* Top-Left Streamer Badge */}
                                    <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-white/90 border border-white/10 z-10">
                                        <span className="truncate max-w-[140px]">{streamerName}'s Screen</span>
                                    </div>

                                    {/* Discord "View Stream" Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                                        <div className="px-4 py-2 bg-obsidian-gold text-obsidian-bg font-extrabold text-xs sm:text-sm rounded-xl shadow-2xl flex items-center gap-2 transform group-hover:scale-105 transition-transform">
                                            <FaDesktop className="w-4 h-4" />
                                            <span>View Stream</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* 2. REGULAR PARTICIPANT CARDS (CLEAN MINIMALIST DISCORD TILES) */}
                        {participants.map((p) => {
                            const camTrack = cameraTracks.find(
                                (t) => t.participant.identity === p.identity
                            );
                            const hasCam = p.isCameraEnabled && camTrack;

                            return (
                                <div
                                    key={p.identity}
                                    className={`relative rounded-2xl bg-[#1e1f22] overflow-hidden flex items-center justify-center aspect-video w-full transition-all duration-150 border-2 ${
                                        p.isSpeaking
                                            ? "border-[#23a55a]"
                                            : "border-white/5 hover:border-white/15"
                                    }`}
                                >
                                    {/* Webcam Video or Discord Initial Avatar */}
                                    {hasCam ? (
                                        <VideoTrack
                                            trackRef={camTrack}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-obsidian-gold to-yellow-600 flex items-center justify-center text-obsidian-bg font-extrabold text-2xl shadow-inner">
                                                {p.name?.charAt(0)?.toUpperCase() || p.identity.charAt(0)?.toUpperCase()}
                                            </div>
                                        </div>
                                    )}

                                    {/* Name Badge */}
                                    <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-medium text-white/90 flex items-center gap-1.5 border border-white/5 z-10">
                                        <span className="truncate max-w-[120px]">{p.name || p.identity}</span>
                                        {p.isLocal && <span className="text-[10px] text-white/50">(You)</span>}
                                        {!p.isMicrophoneEnabled && (
                                            <FaMicrophoneSlash className="w-3 h-3 text-white/40 ml-0.5" />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ======================================== */}
            {/* STREAM WATCHING: BOTTOM PARTICIPANTS FILMSTRIP */}
            {/* ======================================== */}
            {activeFocusedTrack && showBottomParticipants && (
                <div
                    className={`${
                        isFullscreen ? "fixed bottom-24" : "absolute bottom-20"
                    } inset-x-0 mx-auto w-fit max-w-[95%] px-3 py-2 flex items-center gap-2.5 overflow-x-auto z-30 transition-all duration-300 ease-in-out pointer-events-auto bg-[#1e1f22]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl ${
                        isControlsVisible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-40 opacity-0 pointer-events-none"
                    }`}
                >
                    {participants.map((p) => {
                        const camTrack = cameraTracks.find(
                            (t) => t.participant.identity === p.identity
                        );
                        const hasCam = p.isCameraEnabled && camTrack;
                        const otherStreamTrack = screenTracks.find(
                            (t) => t.participant.identity === p.identity
                        );
                        const isStreaming = !!otherStreamTrack;
                        const isCurrentStreamer =
                            activeFocusedTrack.participant?.identity === p.identity;

                        return (
                            <div
                                key={p.identity}
                                onClick={() => {
                                    if (isStreaming && !isCurrentStreamer) {
                                        setSelectedStreamTrack(otherStreamTrack);
                                        setIsGridMode(false);
                                        toast.success(`Switched to ${p.name || p.identity}'s stream`);
                                    }
                                }}
                                className={`relative w-28 h-18 sm:w-32 sm:h-20 rounded-xl overflow-hidden bg-[#111214] flex-shrink-0 flex items-center justify-center border-2 transition-all ${
                                    isStreaming && !isCurrentStreamer ? "cursor-pointer hover:border-obsidian-gold" : ""
                                } ${
                                    isCurrentStreamer
                                        ? "border-obsidian-gold"
                                        : p.isSpeaking
                                        ? "border-[#23a55a]"
                                        : "border-white/5"
                                }`}
                                title={isStreaming && !isCurrentStreamer ? "Click to view this member's stream" : undefined}
                            >
                                {hasCam ? (
                                    <VideoTrack
                                        trackRef={camTrack}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-obsidian-gold to-yellow-600 flex items-center justify-center text-obsidian-bg font-bold text-xs shadow-inner">
                                        {p.name?.charAt(0)?.toUpperCase() || p.identity.charAt(0)?.toUpperCase()}
                                    </div>
                                )}

                                <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between text-[10px] font-medium text-white/90 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded truncate z-10">
                                    <span className="truncate">{p.name || p.identity}</span>
                                    {!p.isMicrophoneEnabled && (
                                        <FaMicrophoneSlash className="w-2.5 h-2.5 text-white/40 ml-1 flex-shrink-0" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ======================================== */}
            {/* DISCORD CENTERED BOTTOM CONTROL DOCK (ALL OPTIONS CONSOLIDATED) */}
            {/* ======================================== */}
            <div
                onMouseEnter={handleDockMouseEnter}
                onMouseLeave={handleDockMouseLeave}
                className={`discord-floating-dock ${
                    isFullscreen ? "fixed bottom-5" : "absolute bottom-3.5"
                } inset-x-0 mx-auto w-fit z-40 flex items-center gap-2 sm:gap-2.5 bg-[#1e1f22]/95 backdrop-blur-md px-3 sm:px-4 py-2 rounded-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.8)] transition-all duration-300 ease-in-out pointer-events-auto ${
                    isControlsVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-28 opacity-0 pointer-events-none"
                }`}
            >
                {/* 1. Filmstrip Toggle Arrow (When Watching Stream) */}
                {activeFocusedTrack && (
                    <button
                        onClick={() => setShowBottomParticipants((prev) => !prev)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 mr-0.5 ${
                            showBottomParticipants
                                ? "bg-white/15 text-white border-white/20"
                                : "bg-[#313338] text-white/70 hover:text-white border-transparent"
                        }`}
                        title={showBottomParticipants ? "Hide Participants Filmstrip" : "Show Participants Filmstrip"}
                    >
                        {showBottomParticipants ? (
                            <FaChevronDown className="w-3.5 h-3.5 text-obsidian-gold" />
                        ) : (
                            <FaChevronUp className="w-3.5 h-3.5 text-obsidian-gold" />
                        )}
                        <span className="hidden sm:inline text-[11px]">
                            {showBottomParticipants ? "Hide Members" : "Show Members"}
                        </span>
                    </button>
                )}

                {/* 2. Grid Mode / Focus Stream Toggle Button */}
                {screenTracks.length > 0 && (
                    <button
                        onClick={() => {
                            if (activeFocusedTrack) {
                                setIsGridMode(true);
                            } else {
                                setIsGridMode(false);
                            }
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 mr-1 ${
                            isGridMode
                                ? "bg-obsidian-gold text-obsidian-bg border-obsidian-gold"
                                : "bg-white/10 text-white/80 hover:text-white border-white/15"
                        }`}
                        title={activeFocusedTrack ? "Switch to Grid View" : "Focus on Stream"}
                    >
                        {activeFocusedTrack ? (
                            <>
                                <FaThLarge className="w-3.5 h-3.5" />
                                <span className="hidden md:inline text-[11px]">Grid View</span>
                            </>
                        ) : (
                            <>
                                <FaDesktop className="w-3.5 h-3.5" />
                                <span className="hidden md:inline text-[11px]">Focus Stream</span>
                            </>
                        )}
                    </button>
                )}

                {/* 3. Camera Button */}
                <button
                    onClick={toggleCamera}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
                        isCameraEnabled
                            ? "bg-white text-black hover:bg-white/90 shadow-md"
                            : "bg-[#313338] text-white hover:bg-[#3b3e45]"
                    }`}
                    title={isCameraEnabled ? "Turn Off Camera" : "Turn On Camera"}
                >
                    {isCameraEnabled ? <FaVideo className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <FaVideoSlash className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white/70" />}
                </button>

                {/* 4. Screen Share Button */}
                <button
                    onClick={toggleScreenShare}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
                        isScreenShareEnabled
                            ? "bg-[#23a55a] text-white hover:bg-[#1f934f] shadow-md"
                            : "bg-[#313338] text-white hover:bg-[#3b3e45]"
                    }`}
                    title={isScreenShareEnabled ? "Stop Sharing Your Screen" : "Share Your Screen"}
                >
                    <FaDesktop className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>

                {/* 5. Microphone Button (M) */}
                <button
                    onClick={toggleMic}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
                        !isMicrophoneEnabled || isDeafened
                            ? "bg-[#da373c] text-white hover:bg-[#c02e34] shadow-md"
                            : "bg-[#313338] text-white hover:bg-[#3b3e45]"
                    }`}
                    title={!isMicrophoneEnabled ? "Unmute Microphone (M)" : "Mute Microphone (M)"}
                >
                    {!isMicrophoneEnabled || isDeafened ? (
                        <FaMicrophoneSlash className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    ) : (
                        <FaMicrophone className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    )}
                </button>

                {/* 6. Deafen Button (D) */}
                <button
                    onClick={toggleDeafen}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
                        isDeafened
                            ? "bg-[#da373c] text-white hover:bg-[#c02e34] shadow-md"
                            : "bg-[#313338] text-white hover:bg-[#3b3e45]"
                    }`}
                    title={isDeafened ? "Undeafen (D)" : "Deafen (D)"}
                >
                    <div className="relative">
                        <FaHeadphones className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                        {isDeafened && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-0.5 bg-white rotate-45 rounded"></div>
                        )}
                    </div>
                </button>

                {/* 7. Stream Quality Pill Button (From removed top menu) */}
                <button
                    onClick={onOpenQualityModal}
                    className="p-2 sm:px-2.5 sm:py-2 rounded-xl text-xs font-mono font-bold bg-[#313338] hover:bg-[#3b3e45] text-white/90 hover:text-white transition-all flex items-center gap-1 border border-white/5"
                    title="Stream Quality Settings"
                >
                    <FaBolt className="w-3.5 h-3.5 text-obsidian-gold" />
                    <span className="hidden lg:inline text-[11px]">{streamResolution}</span>
                </button>

                {/* 8. Fullscreen Toggle (From removed top menu) */}
                <button
                    onClick={toggleFullscreen}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#313338] hover:bg-[#3b3e45] text-white/90 hover:text-white flex items-center justify-center transition-all"
                    title={isFullscreen ? "Exit Fullscreen (Esc or F)" : "Fullscreen (F)"}
                >
                    {isFullscreen ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
                </button>

                {/* 9. Members Sidebar Toggle (From removed top menu) */}
                {participantsPanel && (
                    <button
                        onClick={() => setShowParticipantsPanel((prev) => !prev)}
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
                            showParticipantsPanel
                                ? "bg-obsidian-gold text-obsidian-bg shadow-md"
                                : "bg-[#313338] text-white/90 hover:bg-[#3b3e45] hover:text-white"
                        }`}
                        title="Toggle Members List"
                    >
                        <FaUsers className="w-4 h-4" />
                    </button>
                )}

                {/* 10. Disconnect Button (Red Phone) */}
                {onLeave && (
                    <button
                        onClick={onLeave}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#da373c] hover:bg-[#c02e34] text-white flex items-center justify-center transition-all shadow-md ml-0.5 sm:ml-1"
                        title="Disconnect"
                    >
                        <FaPhoneSlash className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* ======================================== */}
            {/* Members Panel Slide-out (Fullscreen & Embedded) */}
            {/* ======================================== */}
            {showParticipantsPanel && participantsPanel && (
                <div className={`${isFullscreen ? "fixed z-[10005]" : "absolute z-50"} inset-y-0 right-0 w-72 sm:w-80 bg-[#1e1f22] border-l border-white/10 flex flex-col shadow-2xl animate-fade-in-right overflow-y-auto`}>
                    <div className="flex items-center justify-between p-3.5 border-b border-white/10">
                        <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                            Members ({participantCount || participants.length})
                        </span>
                        <button
                            onClick={() => setShowParticipantsPanel(false)}
                            className="p-1 rounded-lg text-white/50 hover:text-white"
                        >
                            <FaTimes className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="p-3 flex-1">{participantsPanel}</div>
                </div>
            )}
        </div>
    );
};

export default LiveKitVideoRoom;
