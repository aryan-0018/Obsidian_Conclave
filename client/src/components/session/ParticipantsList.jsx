import React, { useState } from 'react'
import { FaUsers, FaVolumeMute, FaVolumeUp, FaUserSlash, FaDesktop } from 'react-icons/fa'
import { APP_CONFIG } from '../../utils/constants'
import { setRemoteParticipantVolume } from '../../utils/livekitRoomManager'

const ParticipantsList = ({
  participants: dbParticipants,
  liveKitParticipants,
  hostName,
  hostId,
  isHost,
  roomId,
  currentUserId,
  onMute,
  onRemove,
  onStopScreenShare,
  onSetUserVolume,
}) => {
  const [activeVolumeUserId, setActiveVolumeUserId] = useState(null);
  const [userVolumes, setUserVolumes] = useState({});

  const handleVolumeChange = (userId, newVol) => {
    setUserVolumes(prev => ({ ...prev, [userId]: newVol }));
    setRemoteParticipantVolume(userId, newVol / 100);
    if (onSetUserVolume) {
      onSetUserVolume(userId, newVol / 100);
    }
  };

  // Merge the real-time LiveKit participants with the DB participants. 
  // We prioritize LiveKit participants to know exactly who is in the room right now.
  // We use dbParticipants as a fallback if LiveKit isn't connected yet (e.g. before joining).
  const activeParticipants = liveKitParticipants && liveKitParticipants.length > 0
    ? liveKitParticipants.map(lkp => {
      // Find matching DB participant for extended metadata (handle ObjectId vs string)
      const dbp = dbParticipants?.find(p => (p.userId?.toString() || p.userId) === lkp.identity) || {};
      return {
        ...dbp,
        userId: lkp.identity,
        userName: lkp.name || dbp.userName || lkp.identity,
      };
    })
    : dbParticipants;

  if (!activeParticipants || activeParticipants.length === 0) {
    return (
      <div className='bg-obsidian-card rounded-xl shadow-lg p-6 border border-obsidian-border sticky top-4'>
        <div className='flex items-center mb-4'>
          <FaUsers className='w-5 h-5 mr-3 text-obsidian-gold' />
          <h2 className='text-xl font-bold text-obsidian-text'>
            {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.HEADING}
          </h2>

        </div>
        <div className='text-center py-4 bg-obsidian-secondary rounded-lg border border-obsidian-border/50'>
          <p className='text-sm text-obsidian-muted'>
            {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.EMPTY_MESSAGE}
          </p>
        </div>

      </div>
    )
  }


  const hostParticipants = activeParticipants.filter((p) => p.userName === hostName || (hostId && (p.userId?.toString() || p.userId) === (hostId?.toString() || hostId)));
  const otherParticipants = activeParticipants.filter((p) => p.userName !== hostName && (!hostId || (p.userId?.toString() || p.userId) !== (hostId?.toString() || hostId)));

  const handleMute = (participant) => {
    if (onMute) onMute(roomId, participant.userId);
  };

  const handleRemove = (participant) => {
    if (onRemove) onRemove(roomId, participant.userId);
  };

  const handleStopScreenShare = (participant) => {
    if (onStopScreenShare) onStopScreenShare(roomId, participant.userId);
  };

  return (
    <div className='bg-obsidian-card rounded-xl shadow-lg p-4 sm:p-6 border border-obsidian-border sticky top-4'>
      <div className='flex items-center mb-4 border-b border-obsidian-border pb-4'>
        <FaUsers className='w-5 h-5 mr-3 text-obsidian-gold' />
        <h2 className='text-lg sm:text-xl font-bold text-obsidian-text'>
          {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.HEADING} <span className="text-obsidian-muted text-lg">({activeParticipants.length})</span>
        </h2>

      </div>

      <div className='space-y-3'>
        {hostParticipants.map((p) => {
          const isCurrentUser = currentUserId && (p.userId?.toString() === currentUserId.toString() || p.userId === currentUserId);
          const vol = userVolumes[p.userId] !== undefined ? userVolumes[p.userId] : 100;

          return (
            <div key={p.userId || p.userName} className='p-3 sm:p-4 bg-gradient-to-r from-obsidian-secondary to-obsidian-bg rounded-lg border border-obsidian-gold/30 shadow-[0_0_10px_rgba(212,175,55,0.05)] animate-fade-in'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center min-w-0 flex-1'>
                  <div className='w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-obsidian-gold to-obsidian-goldHover rounded-full flex items-center justify-center mr-3 shadow-inner flex-shrink-0 animate-gold-pulse'>
                    <span className="text-obsidian-bg font-bold text-sm">
                      {p.userName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className='min-w-0'>
                    <p className='font-bold text-obsidian-text truncate'>
                      {p.userName} {isCurrentUser && <span className="text-xs text-obsidian-muted font-normal">(You)</span>}
                    </p>
                    <div className='flex items-center mt-0.5'>
                      <p className='text-[10px] sm:text-xs text-obsidian-gold font-bold uppercase tracking-wider px-1.5 py-0.5 bg-obsidian-gold/10 rounded border border-obsidian-gold/20'>
                        {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.HOST_LABEL}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Discord Per-User Volume Control (for other users) */}
                {!isCurrentUser && (
                  <div className='relative ml-2 flex-shrink-0'>
                    <button
                      onClick={() => setActiveVolumeUserId(activeVolumeUserId === p.userId ? null : p.userId)}
                      title={`Discord User Volume: ${vol}%`}
                      aria-label={`Adjust volume for ${p.userName}`}
                      className={`w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border transition-all ${
                        vol === 0
                          ? 'text-red-400 bg-red-500/15 border-red-500/30'
                          : vol > 100
                          ? 'text-obsidian-gold bg-obsidian-gold/15 border-obsidian-gold/30'
                          : 'text-obsidian-muted border-white/5 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {vol === 0 ? <FaVolumeMute className='w-3.5 h-3.5' /> : <FaVolumeUp className='w-3.5 h-3.5' />}
                    </button>

                    {activeVolumeUserId === p.userId && (
                      <div className='absolute right-0 top-full mt-2 w-52 bg-[#141416]/95 backdrop-blur-md border border-obsidian-gold/40 rounded-xl p-3 shadow-2xl z-50 animate-fade-in text-left'>
                        <div className='flex justify-between items-center mb-2'>
                          <span className='font-bold text-[10px] text-obsidian-muted uppercase tracking-wider'>User Volume</span>
                          <span className='text-xs font-mono font-bold text-obsidian-gold'>{vol}%</span>
                        </div>
                        <input
                          type='range'
                          min='0'
                          max='200'
                          step='1'
                          value={vol}
                          onChange={(e) => handleVolumeChange(p.userId, Number(e.target.value))}
                          className='w-full h-1.5 bg-[#333] rounded-lg appearance-none cursor-pointer accent-obsidian-gold'
                        />
                        <div className='flex justify-between text-[9px] text-obsidian-muted font-mono mt-1'>
                          <span>0%</span>
                          <span>100%</span>
                          <span>200%</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}


        {otherParticipants.length > 0 && (
          <>
            <div className='pt-2 border-t border-obsidian-border text-sm font-semibold text-obsidian-muted uppercase tracking-wider mb-2'>
              {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.JOINED_USERS_LABEL}
            </div>
            {otherParticipants.map((p) => {
              const isCurrentUser = currentUserId && (p.userId?.toString() === currentUserId.toString() || p.userId === currentUserId);
              const vol = userVolumes[p.userId] !== undefined ? userVolumes[p.userId] : 100;

              return (
                <div key={p.userId || p.userName} className='p-3 bg-obsidian-secondary/50 rounded-lg border border-obsidian-border hover:bg-obsidian-secondary transition-colors animate-fade-in'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center min-w-0 flex-1'>
                      <div className='w-8 h-8 sm:w-9 sm:h-9 bg-[#222] border border-[#333] rounded-full flex items-center justify-center mr-3 text-obsidian-text font-bold flex-shrink-0 text-sm'>
                        {p.userName?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className='min-w-0'>
                        <p className='font-semibold text-obsidian-text truncate text-sm'>
                          {p.userName} {isCurrentUser && <span className="text-xs text-obsidian-muted font-normal">(You)</span>}
                        </p>
                        <p className='text-[10px] sm:text-xs text-obsidian-muted mt-0.5'>
                          {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.PARTICIPANT_LABEL}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-1.5 ml-2 flex-shrink-0'>
                      {/* Discord Per-User Volume Control */}
                      {!isCurrentUser && (
                        <div className='relative'>
                          <button
                            onClick={() => setActiveVolumeUserId(activeVolumeUserId === p.userId ? null : p.userId)}
                            title={`Discord User Volume: ${vol}%`}
                            aria-label={`Adjust volume for ${p.userName}`}
                            className={`w-8 h-8 flex items-center justify-center rounded-md border transition-all ${
                              vol === 0
                                ? 'text-red-400 bg-red-500/15 border-red-500/30'
                                : vol > 100
                                ? 'text-obsidian-gold bg-obsidian-gold/15 border-obsidian-gold/30'
                                : 'text-obsidian-muted border-white/5 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {vol === 0 ? <FaVolumeMute className='w-3.5 h-3.5' /> : <FaVolumeUp className='w-3.5 h-3.5' />}
                          </button>

                          {activeVolumeUserId === p.userId && (
                            <div className='absolute right-0 top-full mt-2 w-52 bg-[#141416]/95 backdrop-blur-md border border-obsidian-gold/40 rounded-xl p-3 shadow-2xl z-50 animate-fade-in text-left'>
                              <div className='flex justify-between items-center mb-2'>
                                <span className='font-bold text-[10px] text-obsidian-muted uppercase tracking-wider'>User Volume</span>
                                <span className='text-xs font-mono font-bold text-obsidian-gold'>{vol}%</span>
                              </div>
                              <input
                                type='range'
                                min='0'
                                max='200'
                                step='1'
                                value={vol}
                                onChange={(e) => handleVolumeChange(p.userId, Number(e.target.value))}
                                className='w-full h-1.5 bg-[#333] rounded-lg appearance-none cursor-pointer accent-obsidian-gold'
                              />
                              <div className='flex justify-between text-[9px] text-obsidian-muted font-mono mt-1'>
                                <span>0%</span>
                                <span>100%</span>
                                <span>200%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Host Controls */}
                      {isHost && (
                        <>
                          <button
                            onClick={() => handleMute(p)}
                            title={APP_CONFIG.SESSION_CONTENT.HOST_CONTROLS.MUTE}
                            aria-label={`Mute ${p.userName}`}
                            className='w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-md text-obsidian-muted hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors'
                          >
                            <FaVolumeMute className='w-4 h-4 sm:w-3.5 sm:h-3.5' />
                          </button>
                          <button
                            onClick={() => handleStopScreenShare(p)}
                            title={APP_CONFIG.SESSION_CONTENT.HOST_CONTROLS.STOP_SCREENSHARE}
                            aria-label={`Stop screen share for ${p.userName}`}
                            className='w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-md text-obsidian-muted hover:text-orange-400 hover:bg-orange-500/10 transition-colors'
                          >
                            <FaDesktop className='w-4 h-4 sm:w-3.5 sm:h-3.5' />
                          </button>
                          <button
                            onClick={() => handleRemove(p)}
                            title={APP_CONFIG.SESSION_CONTENT.HOST_CONTROLS.REMOVE}
                            aria-label={`Remove ${p.userName}`}
                            className='w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-md text-obsidian-muted hover:text-red-400 hover:bg-red-500/10 transition-colors'
                          >
                            <FaUserSlash className='w-4 h-4 sm:w-3.5 sm:h-3.5' />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}


      </div>
    </div>
  )
}

export default ParticipantsList