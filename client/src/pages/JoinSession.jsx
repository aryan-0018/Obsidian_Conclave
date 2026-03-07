import React, { useEffect, useState } from 'react'
import { useSession } from '../context/sessionContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLiveKit } from '../hooks/useLiveKit';
import { APP_CONFIG, ROUTES } from '../utils/constants';
import api from '../service/api';
import { API_ENDPOINTS } from '../utils/constants';
import SessionHeader from '../components/session/SessionHeader';
import JoinForm from '../components/session/JoinForm';
import ParticipantsList from '../components/session/ParticipantsList';
import LiveKitVideoRoom from '../components/session/LiveKitVideoRoom';
import toast from 'react-hot-toast';

const JoinSession = () => {
  const [roomId, setRoomId] = useState('')
  const [localError, setLocalError] = useState('')
  const [sessionJoined, setSessionJoined] = useState(false);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [searchParams] = useSearchParams();

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
      setSessionJoined(true);

      if (result.session.isHost) {
        navigate(`${ROUTES.HOST}?roomId=${roomId}`)
        return;
      }

      // Connect to LiveKit room
      await connectToRoom(roomId);
    }
  }

  // Poll for participant updates
  useEffect(() => {
    if (!sessionJoined || !roomId) return;
    const interval = setInterval(async () => {
      const res = await getSession(roomId)
      if (res.success) {
        if (res.session.status === 'ended') {
          disconnectFromRoom();
          toast.error("The host has ended the session");
          navigate(ROUTES.DASHBOARD);
        } else {
          setSessionInfo(res.session);
        }
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [sessionJoined, roomId, getSession, disconnectFromRoom, navigate])

  const handleLeave = async () => {
    disconnectFromRoom();

    if (sessionJoined) {
      await api.post(API_ENDPOINTS.SESSION.LEAVE, { roomId });
    }

    navigate(ROUTES.DASHBOARD)
  }

  return (
    <div className="min-h-screen bg-obsidian-bg">
      <SessionHeader
        title={APP_CONFIG.SESSION_CONTENT.HEADER.JOINING_TITLE}
        roomId={sessionJoined ? roomId : ''}
        onBack={() => navigate(ROUTES.DASHBOARD)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!sessionJoined ? (
          <JoinForm
            roomId={roomId}
            error={error || localError}
            loading={loading}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
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
              />
            </div>

            <div className="lg:col-span-1">
              {sessionInfo && (
                <ParticipantsList
                  participants={sessionInfo.participants}
                  hostName={sessionInfo.hostName}
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