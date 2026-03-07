import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { APP_CONFIG } from '../../utils/constants'

const SessionHeader = ({ title, roomId, userName, onBack, showEndBUtton, onEndSession }) => {
    return (
        <header className='bg-obsidian-card shadow-sm border-b border-obsidian-border'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center space-x-4'>
                        <button
                            onClick={onBack}
                            className='p-2 text-obsidian-muted hover:text-obsidian-gold hover:bg-obsidian-secondary rounded-lg transition-colors'
                        >
                            <FaArrowLeft className='w-5 h-5' />
                        </button>
                        <div>
                            <h1 className='text-xl font-bold text-obsidian-text'>
                                {title}
                            </h1>
                            <p className='text-sm text-obsidian-muted'>
                                Room ID: <span className='text-obsidian-gold font-mono'>{roomId}</span>
                            </p>
                        </div>

                    </div>

                    <div className='flex items-center space-x-4'>
                        {userName && (
                            <div className='hidden sm:flex items-center space-x-2 px-3 py-2 bg-obsidian-secondary border border-obsidian-border rounded-lg'>
                                <div className='w-8 h-8 bg-gradient-to-br from-obsidian-gold to-obsidian-goldHover rounded-full flex items-center justify-center'>
                                    <span className='text-obsidian-bg text-xs font-bold'>
                                        {userName?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className='text-obsidian-text font-medium text-sm'>
                                    {userName}
                                </span>
                            </div>
                        )}

                        {showEndBUtton && (
                            <button
                                onClick={onEndSession}
                                className='px-4 py-2 text-sm font-bold text-obsidian-text bg-destructive/80 border border-destructive rounded-lg hover:bg-destructive focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-obsidian-bg focus:ring-destructive transition-colors shadow-sm'
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