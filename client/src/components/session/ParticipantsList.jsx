import React from 'react'
import { FaUsers, FaVolumeMute, FaUserSlash, FaDesktop } from 'react-icons/fa'
import { APP_CONFIG } from '../../utils/constants'

const ParticipantsList = ({ participants: dbParticipants, liveKitParticipants, hostName, hostId, isHost, roomId, onMute, onRemove, onStopScreenShare }) => {

  // Merge the real-time LiveKit participants with the DB participants. 
  // We prioritize LiveKit participants to know exactly who is in the room right now.
  // We use dbParticipants as a fallback if LiveKit isn't connected yet (e.g. before joining).
  const activeParticipants = liveKitParticipants && liveKitParticipants.length > 0
    ? liveKitParticipants.map(lkp => {
      // Find matching DB participant for extended metadata (like specific mapped names)
      const dbp = dbParticipants?.find(p => p.userId === lkp.identity) || {};
      return {
        userId: lkp.identity,
        userName: lkp.name || dbp.userName || lkp.identity,
        ...dbp
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


  const hostParticipants = activeParticipants.filter((p) => p.userName === hostName || (hostId && p.userId === hostId));
  const otherParticipants = activeParticipants.filter((p) => p.userName !== hostName && (!hostId || p.userId !== hostId));

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
        {hostParticipants.map((p) => (
          <div key={p.userId || p.userName} className='p-3 sm:p-4 bg-gradient-to-r from-obsidian-secondary to-obsidian-bg rounded-lg border border-obsidian-gold/30 shadow-[0_0_10px_rgba(212,175,55,0.05)] animate-fade-in'>
            <div className='flex items-center'>
              <div className='w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-obsidian-gold to-obsidian-goldHover rounded-full flex items-center justify-center mr-3 shadow-inner flex-shrink-0 animate-gold-pulse'>
                <span className="text-obsidian-bg font-bold text-sm">
                  {p.userName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className='min-w-0'>
                <p className='font-bold text-obsidian-text truncate'>
                  {p.userName}
                </p>
                <div className='flex items-center mt-0.5'>
                  <p className='text-[10px] sm:text-xs text-obsidian-gold font-bold uppercase tracking-wider px-1.5 py-0.5 bg-obsidian-gold/10 rounded border border-obsidian-gold/20'>
                    {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.HOST_LABEL}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}


        {otherParticipants.length > 0 && (
          <>
            <div className='pt-2 border-t border-obsidian-border text-sm font-semibold text-obsidian-muted uppercase tracking-wider mb-2'>
              {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.JOINED_USERS_LABEL}
            </div>
            {otherParticipants.map((p) => (
              <div key={p.userId || p.userName} className='p-3 bg-obsidian-secondary/50 rounded-lg border border-obsidian-border hover:bg-obsidian-secondary transition-colors animate-fade-in'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center min-w-0 flex-1'>
                    <div className='w-8 h-8 sm:w-9 sm:h-9 bg-[#222] border border-[#333] rounded-full flex items-center justify-center mr-3 text-obsidian-text font-bold flex-shrink-0 text-sm'>
                      {p.userName?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className='min-w-0'>
                      <p className='font-semibold text-obsidian-text truncate text-sm'>
                        {p.userName}
                      </p>
                      <p className='text-[10px] sm:text-xs text-obsidian-muted mt-0.5'>
                        {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.PARTICIPANT_LABEL}
                      </p>
                    </div>
                  </div>

                  {/* Host Controls - Enhanced for Mobile Accessibility */}
                  {isHost && (
                    <div className='flex items-center gap-1.5 ml-2 flex-shrink-0'>
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
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}


      </div>
    </div>
  )
}

export default ParticipantsList