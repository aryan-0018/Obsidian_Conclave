import React, { useEffect, useState } from "react";
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

const HostSession = () => {
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roomCopied, setRoomCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const { currentSession, getSession, clearSession } = useSession();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const roomId = searchParams.get("roomId") || currentSession?.roomId;

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

  // Poll participant list to keep it updated
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
          if (
            prev &&
            prev.participantCount === res.session.participantCount &&
            prev.status === res.session.status &&
            prev.participants?.length === res.session.participants?.length
          ) {
            return prev;
          }
          return res.session;
        });
      }
    }, 5000);

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
    if (!sessionInfo || !sessionInfo.isHost) return;

    try {
      disconnectFromRoom();

      await api.post(`${API_ENDPOINTS.SESSION.END}/${sessionInfo.id}`);
      clearSession();
      toast.success("Session ended successfully");
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      toast.error("Failed to end session. Please try again");
    }
  };

  const handleLeave = async () => {
    if (sessionInfo?.isHost) {
      handleEndSession();
    } else {
      disconnectFromRoom();
      await api.post(API_ENDPOINTS.SESSION.LEAVE, { roomId });
      clearSession();
      navigate(ROUTES.DASHBOARD);
    }
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
    return null;
  }

  return (
    <div className="min-h-screen bg-obsidian-bg">
      <SessionHeader
        title={APP_CONFIG.SESSION_CONTENT.HEADER.HOSTING_TITLE}
        roomId={roomId}
        userName={user?.name}
        onBack={handleBack}
        showEndBUtton={sessionInfo.isHost}
        onEndSession={handleEndSession}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SessionInfoCard
              roomId={roomId}
              shareableLink={getShareableLink()}
              status={sessionInfo.status}
              participantCount={sessionInfo.participantCount}
              copied={copied}
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
              leaveButtonText={
                sessionInfo?.isHost
                  ? APP_CONFIG.SESSION_CONTENT.VIDEO.END_BUTTON
                  : APP_CONFIG.SESSION_CONTENT.VIDEO.LEAVE_BUTTON
              }
            />
          </div>

          <div className="lg:col-span-1">
            <ParticipantsList
              participants={sessionInfo.participants}
              hostName={sessionInfo.hostName}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HostSession;
