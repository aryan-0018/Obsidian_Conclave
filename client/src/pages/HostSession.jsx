import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "../context/sessionContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLiveKit } from "../hooks/useLiveKit";
import { API_ENDPOINTS, APP_CONFIG, ROUTES } from "../utils/constants";
import { copyToClipboard } from "../utils/helpers";
import api from "../service/api";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import SessionHeader from "../components/session/SessionHeader";
import SessionInfoCard from "../components/session/SessionInfoCard";
import ParticipantsList from "../components/session/ParticipantsList";
import LiveKitVideoRoom from "../components/session/LiveKitVideoRoom";
import PendingParticipants from "../components/session/PendingParticipants";

const HostSession = () => {
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roomCopied, setRoomCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const {
    currentSession,
    getSession,
    clearSession,
    admitParticipant,
    denyParticipant,
    removeParticipant,
    muteParticipant,
    stopScreenShare,
  } = useSession();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [liveKitParticipants, setLiveKitParticipants] = useState(null);

  const roomId = searchParams.get("roomId") || currentSession?.roomId;
  const notifiedPendingIds = useRef(new Set());

  const {
    livekitToken,
    livekitUrl,
    error: livekitError,
    loading: livekitLoading,
    isConnected,
    connectToRoom,
    disconnectFromRoom,
    onConnected,
    onDisconnected,
  } = useLiveKit();

  // Load session information
  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      if (!roomId) {
        navigate(ROUTES.DASHBOARD);
        return;
      }

      setLoading(true);
      const result = await getSession(roomId);

      if (!isMounted) return;

      if (result.success) {
        setSessionInfo(result.session);
        // Connect to LiveKit room once session is loaded
        await connectToRoom(roomId);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
      setLoading(false);
    };
    loadSession();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, getSession, navigate]);

  // Host controls defined before polling effect
  const handleAdmit = useCallback(async (targetRoomId, pendingUserId) => {
    const activeRoomId = targetRoomId || roomId;
    const result = await admitParticipant(activeRoomId, pendingUserId);
    if (result.success) {
      toast.success(result.data?.message || "Participant admitted");
      const res = await getSession(activeRoomId);
      if (res.success) setSessionInfo(res.session);
    } else {
      toast.error(result.error || "Failed to admit participant");
    }
  }, [admitParticipant, getSession, roomId]);

  const handleDeny = useCallback(async (targetRoomId, pendingUserId) => {
    const activeRoomId = targetRoomId || roomId;
    const result = await denyParticipant(activeRoomId, pendingUserId);
    if (result.success) {
      toast.success(result.data?.message || "Participant denied");
      const res = await getSession(activeRoomId);
      if (res.success) setSessionInfo(res.session);
    } else {
      toast.error(result.error || "Failed to deny participant");
    }
  }, [denyParticipant, getSession, roomId]);

  const handleMute = useCallback(async (targetRoomId, participantUserId) => {
    const activeRoomId = targetRoomId || roomId;
    const result = await muteParticipant(activeRoomId, participantUserId);
    if (result.success) {
      toast.success("Participant muted");
    } else {
      toast.error(result.error || "Failed to mute participant");
    }
  }, [muteParticipant, roomId]);

  const handleRemove = useCallback(async (targetRoomId, targetUserId) => {
    const activeRoomId = targetRoomId || roomId;
    const result = await removeParticipant(activeRoomId, targetUserId);
    if (result.success) {
      toast.success(result.data?.message || "Participant removed");
      const res = await getSession(activeRoomId);
      if (res.success) setSessionInfo(res.session);
    } else {
      toast.error(result.error || "Failed to remove participant");
    }
  }, [removeParticipant, getSession, roomId]);

  const handleStopScreenShare = useCallback(async (targetRoomId, participantUserId) => {
    const activeRoomId = targetRoomId || roomId;
    const result = await stopScreenShare(activeRoomId, participantUserId);
    if (result.success) {
      toast.success("Screen share stopped");
    } else {
      toast.error(result.error || "Failed to stop screen share");
    }
  }, [stopScreenShare, roomId]);

  // Poll participant list + pending list to keep it updated
  useEffect(() => {
    if (!roomId) return;
    const interval = setInterval(async () => {
      const res = await getSession(roomId);
      if (res.success && res.session) {
        if (res.session.status === 'ended') {
          disconnectFromRoom();
          navigate(ROUTES.DASHBOARD);
          return;
        }
        setSessionInfo((prev) => {
          // Check for new pending participants to notify
          if (res.session.meetingType === 'private' && res.session.isHost && res.session.pendingParticipants?.length > 0) {
            res.session.pendingParticipants.forEach(user => {
              const pendingId = user.userId || user._id;
              if (!notifiedPendingIds.current.has(pendingId)) {
                notifiedPendingIds.current.add(pendingId);

                // Show custom toast with Admit/Deny buttons
                toast((t) => (
                  <div className="flex flex-col gap-3 min-w-[250px]">
                    <div>
                      <span className="font-semibold text-white">{user.userName || user.name}</span>
                      <p className="text-sm text-obsidian-muted mt-1">wants to join</p>
                    </div>
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => {
                          handleAdmit(roomId, pendingId);
                          toast.dismiss(t.id);
                        }}
                        className="flex-1 bg-green-600/20 text-green-500 border border-green-500/30 hover:bg-green-600/40 px-3 py-1.5 rounded text-sm font-semibold transition-colors"
                      >
                        Admit
                      </button>
                      <button
                        onClick={() => {
                          handleDeny(roomId, pendingId);
                          toast.dismiss(t.id);
                        }}
                        className="flex-1 bg-red-600/20 text-red-500 border border-red-500/30 hover:bg-red-600/40 px-3 py-1.5 rounded text-sm font-semibold transition-colors"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                ), {
                  duration: 10000, // Stay for 10 seconds
                  position: 'top-right',
                  style: {
                    background: '#111',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                  },
                });
              }
            });
          }

          if (
            prev &&
            prev.participantCount === res.session.participantCount &&
            prev.status === res.session.status &&
            prev.participants?.length === res.session.participants?.length &&
            prev.pendingParticipants?.length === res.session.pendingParticipants?.length
          ) {
            return prev;
          }
          return res.session;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [roomId, getSession, disconnectFromRoom, navigate]);

  const handleCopyRoomId = async () => {
    if (roomId) {
      const success = await copyToClipboard(roomId);
      if (success) {
        setRoomCopied(true);
        setTimeout(() => setRoomCopied(false), 2000);
      }
    }
  };

  const getShareableLink = () => {
    const baseURL = window.location.origin;
    return `${baseURL}${ROUTES.JOIN}?roomId=${roomId}`;
  };

  const handleCopyLink = async () => {
    const link = getShareableLink();
    const success = await copyToClipboard(link);
    if (success) {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  // Handle end session
  const handleEndSession = async () => {
    const sessionId = sessionInfo?.id || sessionInfo?._id;
    if (!sessionInfo || !sessionInfo.isHost || !sessionId) return;

    try {
      disconnectFromRoom();

      await api.post(`${API_ENDPOINTS.SESSION.END}/${sessionId}`);
      clearSession();
      toast.success("Session ended successfully");
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      toast.error("Failed to end session. Please try again");
    }
  };

  const handleLeave = async () => {
    disconnectFromRoom();
    await api.post(API_ENDPOINTS.SESSION.LEAVE, { roomId });
    clearSession();
    navigate(ROUTES.DASHBOARD);
  };

  const handleBack = () => {
    navigate(ROUTES.DASHBOARD);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-bg">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-obsidian-gold mx-auto" />
          <p className="mt-4 text-obsidian-muted">
            {APP_CONFIG.LOADING_MESSAGES.SESSION}
          </p>
        </div>
      </div>
    );
  }

  if (!sessionInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-bg text-white">
        Loading session...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-obsidian-bg">
      <SessionHeader
        title={APP_CONFIG.SESSION_CONTENT.HEADER.HOSTING_TITLE}
        roomId={roomId}
        userName={user?.name}
        onBack={handleBack}
        showEndBUtton={sessionInfo?.isHost}
        onEndSession={handleEndSession}
        meetingType={sessionInfo?.meetingType}
      />

      <main className="mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-3 space-y-6">
            <SessionInfoCard
              roomId={roomId}
              shareableLink={getShareableLink()}
              status={sessionInfo?.status}
              participantCount={liveKitParticipants?.length ?? sessionInfo?.participantCount ?? 0}
              roomCopied={roomCopied}
              linkCopied={linkCopied}
              onCopyRoomId={handleCopyRoomId}
              onCopyLink={handleCopyLink}
            />

            <LiveKitVideoRoom
              token={livekitToken}
              serverUrl={livekitUrl}
              isConnected={isConnected}
              error={livekitError}
              loading={livekitLoading}
              onConnected={onConnected}
              onDisconnected={onDisconnected}
              onLeave={handleLeave}
              leaveButtonText={APP_CONFIG.SESSION_CONTENT.VIDEO.LEAVE_BUTTON}
              startedAt={sessionInfo?.startedAt}
              participantCount={liveKitParticipants?.length ?? sessionInfo?.participantCount ?? 0}
              participantsPanel={
                <div className="flex flex-col h-full bg-obsidian-bg rounded-lg overflow-hidden border border-obsidian-border/50">
                  <ParticipantsList
                    participants={sessionInfo?.participants}
                    liveKitParticipants={liveKitParticipants}
                    hostId={sessionInfo?.host}
                    hostName={sessionInfo?.hostName}
                    currentUserId={user?.id || user?._id}
                    isHost={sessionInfo?.isHost}
                    roomId={roomId}
                    onRemove={handleRemove}
                    onMute={handleMute}
                    onStopScreenShare={handleStopScreenShare}
                  />
                  {sessionInfo?.meetingType === 'private' && sessionInfo?.isHost && (
                    <div className="mt-4 border-t border-obsidian-border/50 pt-4">
                      <PendingParticipants
                        pendingParticipants={sessionInfo?.pendingParticipants}
                        onAdmit={handleAdmit}
                        onDeny={handleDeny}
                        roomId={roomId}
                      />
                    </div>
                  )}
                </div>
              }
              onParticipantsUpdate={setLiveKitParticipants}
            />


          </div>

          <div className="lg:col-span-1 space-y-4">
            {/* Pending Participants (waiting room) - only for private meetings */}
            {sessionInfo?.meetingType === 'private' && sessionInfo?.isHost && (
              <PendingParticipants
                pendingParticipants={sessionInfo?.pendingParticipants}
                onAdmit={handleAdmit}
                onDeny={handleDeny}
                roomId={roomId}
              />
            )}

            <ParticipantsList
              participants={sessionInfo?.participants}
              liveKitParticipants={liveKitParticipants}
              hostId={sessionInfo?.host}
              hostName={sessionInfo?.hostName}
              currentUserId={user?.id || user?._id}
              isHost={sessionInfo?.isHost}
              roomId={roomId}
              onMute={handleMute}
              onRemove={handleRemove}
              onStopScreenShare={handleStopScreenShare}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HostSession;
