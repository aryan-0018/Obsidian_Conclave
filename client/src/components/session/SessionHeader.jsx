import React from 'react'
import { FaArrowLeft, FaGlobe, FaLock } from 'react-icons/fa'
import { APP_CONFIG } from '../../utils/constants'

const SessionHeader = ({ title, roomId, userName, onBack, showEndBUtton, onEndSession, meetingType }) => {
    return (
        <header className='bg-obsidian-card shadow-sm border-b border-obsidian-border'>
            <div className='mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4'>
                <div className='flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 sm:gap-2'>
                    <div className='flex items-center space-x-2 sm:space-x-4 min-w-0 w-full sm:w-auto'>
                        <button
                            onClick={onBack}
                            className='p-2 text-obsidian-muted hover:text-obsidian-gold hover:bg-obsidian-secondary rounded-lg transition-colors flex-shrink-0'
                            aria-label="Go back"
                            title="Go back"
                        >
                            <FaArrowLeft className='w-4 h-4 sm:w-5 sm:h-5' />
                        </button>
                        <div className='min-w-0 flex-1'>
                            <div className='flex flex-wrap items-center gap-2'>
                                <h1 className='text-base sm:text-xl font-bold text-obsidian-text truncate'>
                                    {title}
                                </h1>
                                {meetingType && (
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border flex-shrink-0 ${meetingType === 'private'
                                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                                        : 'bg-green-500/10 text-green-400 border-green-500/30'
                                        }`}>
                                        {meetingType === 'private' ? <FaLock className='w-2.5 h-2.5' aria-hidden="true" /> : <FaGlobe className='w-2.5 h-2.5' aria-hidden="true" />}
                                        {meetingType === 'private' ? 'Private' : 'Public'}
                                    </span>
                                )}
                            </div>
                            {roomId && (
                                <p className='text-xs sm:text-sm text-obsidian-muted truncate mt-0.5'>
                                    Room: <span className='text-obsidian-gold font-mono'>{roomId}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className='flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-2 sm:space-x-4 flex-shrink-0 pl-10 sm:pl-0'>
                        {userName && (
                            <div className='hidden sm:flex items-center space-x-2 px-3 py-2 bg-obsidian-secondary border border-obsidian-border rounded-lg'>
                                <div className='w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-obsidian-gold to-obsidian-goldHover rounded-full flex items-center justify-center'>
                                    <span className='text-obsidian-bg text-xs font-bold'>
                                        {userName?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className='text-obsidian-text font-medium text-sm max-w-[100px] truncate'>
                                    {userName}
                                </span>
                            </div>
                        )}

                        {showEndBUtton && (
                            <button
                                onClick={onEndSession}
                                className='px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-obsidian-text bg-destructive/80 border border-destructive rounded-lg hover:bg-obsidian-goldHover hover:text-obsidian-bg hover:border-obsidian-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-obsidian-bg focus:ring-obsidian-gold transition-colors shadow-sm whitespace-nowrap'
                            >
                                {APP_CONFIG.SESSION_CONTENT.HEADER.END_SESSION_BUTTON}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default SessionHeader