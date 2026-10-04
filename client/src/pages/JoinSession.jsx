import React, { useEffect, useState, useRef } from 'react'
import { useSession } from '../context/sessionContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLiveKit } from '../hooks/useLiveKit';
import { APP_CONFIG, ROUTES } from '../utils/constants';
import api from '../service/api';
import { API_ENDPOINTS } from '../utils/constants';
import SessionHeader from '../components/session/SessionHeader';
import JoinForm from '../components/session/JoinForm';
import ParticipantsList from '../components/session/ParticipantsList';
import LiveKitVideoRoom from '../components/session/LiveKitVideoRoom';
import WaitingRoom from '../components/session/WaitingRoom';
import toast from 'react-hot-toast';

const JoinSession = () => {
  const { user } = useAuth();
  const [roomId, setRoomId] = useState('')
  const [localError, setLocalError] = useState('')
  const [sessionJoined, setSessionJoined] = useState(false);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [searchParams] = useSearchParams();
  const [joinStatus, setJoinStatus] = useState('none'); // 'none' | 'pending' | 'joined' | 'denied'
  const joinStatusRef = useRef(joinStatus);
  const [liveKitParticipants, setLiveKitParticipants] = useState(null);

  // Keep ref in sync with state so interval callbacks always read the latest value
  useEffect(() => {
    joinStatusRef.current = joinStatus;
  }, [joinStatus]);

  const { joinSession, getSession, loading, error } = useSession();
  const navigate = useNavigate();

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

  // Check if room id exists in URL params
  useEffect(() => {
    const urlRoomId = searchParams.get('roomId');
    if (urlRoomId) {
      setRoomId(urlRoomId)
    }
  }, [searchParams])

  // Handle input change
  const handleChange = (e) => {
    setRoomId(e.target.value.toUpperCase().trim());
    setLocalError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('')

    if (!roomId) {
      setLocalError('Please enter a room ID')
      return;
    }

    const result = await joinSession(roomId)

    if (result.success) {
      setSessionInfo(result.session)

      if (result.session.isHost) {
        navigate(`${ROUTES.HOST}?roomId=${roomId}`)
        return;
      }

      const status = result.session.joinStatus || 'joined';
      setJoinStatus(status);

      if (status === 'joined') {
        setSessionJoined(true);
        // Connect to LiveKit room
        await connectToRoom(roomId);
      } else if (status === 'pending') {
        // User is in waiting room — don't connect to LiveKit yet
        setSessionJoined(false);
      }
    }
  }

  // Poll for status updates (participant list + waiting room admission)
  useEffect(() => {
    if (joinStatus !== 'pending' && !sessionJoined) return;
    if (!roomId) return;

    const interval = setInterval(async () => {
      const currentStatus = joinStatusRef.current;
      const res = await getSession(roomId)
      if (res.success) {
        if (res.session.status === 'ended') {
          disconnectFromRoom();
          if (currentStatus === 'pending') {
            setJoinStatus('ended');
          } else {
            toast.error("The host has ended the session");
            navigate(ROUTES.DASHBOARD);
          }
          return;
        }

        setSessionInfo(res.session);

        // Check if user was admitted while pending
        if (currentStatus === 'pending' && res.session.joinStatus === 'joined') {
          setJoinStatus('joined');
          setSessionJoined(true);
          toast.success("You've been admitted to the session!");
          // Now connect to LiveKit
          await connectToRoom(roomId);
        }

        // Check if user was denied while pending
        if (currentStatus === 'pending' && res.session.joinStatus === 'none') {
          setJoinStatus('denied');
        }

        // Check if user was removed/kicked while in active session
        if (currentStatus === 'joined' && res.session.joinStatus === 'none') {
          disconnectFromRoom();
          toast.error("You have been removed from the session by the host");
          navigate(ROUTES.DASHBOARD);
          return;
        }
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [joinStatus, sessionJoined, roomId, getSession, disconnectFromRoom, navigate, connectToRoom])

  const handleLeave = async () => {
    disconnectFromRoom();

    if (sessionJoined || joinStatus === 'pending') {
      await api.post(API_ENDPOINTS.SESSION.LEAVE, { roomId });
    }

    navigate(ROUTES.DASHBOARD)
  }

  // Show join form if not submitted yet
  const showJoinForm = joinStatus === 'none' && !sessionJoined;
  // Show waiting room if pending
  const showWaitingRoom = joinStatus === 'pending';
  // Show denied (but not if session ended — that's a separate state)
  const showDenied = joinStatus === 'denied';
  // Show session ended while waiting
  const showSessionEnded = joinStatus === 'ended';
  // Show video room if joined
  const showVideoRoom = joinStatus === 'joined' && sessionJoined;

  return (
    <div className="min-h-screen bg-obsidian-bg">
      <SessionHeader
        title={APP_CONFIG.SESSION_CONTENT.HEADER.JOINING_TITLE}
        roomId={showVideoRoom || showWaitingRoom ? roomId : ''}
        userName={user?.name}
        onBack={() => navigate(ROUTES.DASHBOARD)}
        meetingType={sessionInfo?.meetingType}
      />

      <main className="mx-auto px-2 sm:px-6 lg:px-8 py-6 sm:py-12">
        {showJoinForm && (
          <JoinForm
            roomId={roomId}
            error={error || localError}
            loading={loading}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        )}

        {showWaitingRoom && (
          <WaitingRoom
            roomId={roomId}
            hostName={sessionInfo?.hostName}
            onLeave={handleLeave}
          />
        )}

        {showDenied && (
          <WaitingRoom
            roomId={roomId}
            hostName={sessionInfo?.hostName}
            onLeave={handleLeave}
            denied={true}
          />
        )}

        {showSessionEnded && (
          <WaitingRoom
            roomId={roomId}
            hostName={sessionInfo?.hostName}
            onLeave={handleLeave}
            sessionEnded={true}
          />
        )}

        {showVideoRoom && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 h-full">
            <div className="lg:col-span-3 space-y-6">
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
                      hostName={sessionInfo?.hostName}
                      hostId={sessionInfo?.host}
                      currentUserId={user?.id || user?._id}
                      roomId={roomId}
                    />
                  </div>
                }
                onParticipantsUpdate={setLiveKitParticipants}
              />
            </div>

            <div className="lg:col-span-1">
              {sessionInfo && (
                <ParticipantsList
                  participants={sessionInfo?.participants}
                  liveKitParticipants={liveKitParticipants}
                  hostName={sessionInfo?.hostName}
                  hostId={sessionInfo?.host}
                  currentUserId={user?.id || user?._id}
                  roomId={roomId}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default JoinSession