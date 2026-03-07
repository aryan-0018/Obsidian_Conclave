import React from 'react'
import { FaUsers } from 'react-icons/fa'
import { APP_CONFIG } from '../../utils/constants'

const ParticipantsList = ({ participants, hostName }) => {

  if (!participants || participants.length === 0) {
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


  const hostParticipants = participants.filter((p) => p.userName === hostName);
  const otherParticipants = participants.filter((p) => p.userName !== hostName)
  return (
    <div className='bg-obsidian-card rounded-xl shadow-lg p-6 border border-obsidian-border sticky top-4'>
      <div className='flex items-center mb-4 border-b border-obsidian-border pb-4'>
        <FaUsers className='w-5 h-5 mr-3 text-obsidian-gold' />
        <h2 className='text-xl font-bold text-obsidian-text'>
          {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.HEADING} <span className="text-obsidian-muted text-lg">({participants.length})</span>
        </h2>

      </div>

      <div className='space-y-3'>
        {hostParticipants.map((p) => (
          <div key={p.userId || p.userName} className='p-4 bg-gradient-to-r from-obsidian-secondary to-obsidian-bg rounded-lg border border-obsidian-gold/30 shadow-[0_0_10px_rgba(212,175,55,0.05)]'>
            <div className='flex items-center'>
              <div className='w-10 h-10 bg-gradient-to-br from-obsidian-gold to-obsidian-goldHover rounded-full flex items-center justify-center mr-3 shadow-inner'>
                <span className="text-obsidian-bg font-bold">
                  {p.userName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className='font-bold text-obsidian-text'>
                  {p.userName}
                </p>
                <p className='text-xs text-obsidian-gold font-bold uppercase tracking-wider mt-0.5'>
                  {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.HOST_LABEL}
                </p>
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
              <div key={p.userId || p.userName} className='p-3 bg-obsidian-secondary/50 rounded-lg border border-obsidian-border flex items-center hover:bg-obsidian-secondary transition-colors'>
                <div className='w-9 h-9 bg-[#222] border border-[#333] rounded-full flex items-center justify-center mr-3 text-obsidian-text font-bold'>
                  {p.userName?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className='font-semibold text-obsidian-text'>
                    {p.userName}
                  </p>
                  <p className='text-xs text-obsidian-muted mt-0.5'>
                    {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.PARTICIPANT_LABEL}
                  </p>
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