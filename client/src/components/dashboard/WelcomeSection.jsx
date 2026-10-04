import React from 'react'
import { APP_CONFIG } from '../../utils/constants'

const WelcomeSection = ({ userName }) => {
  return (
    <div className='text-center mb-12'>
      <h2 className='text-4xl font-bold text-obsidian-text mb-3'>
        {APP_CONFIG.DASHBOARD_CONTENT.WELCOME.GREETING.replace('{userName}', userName || 'Distinguished Member')}
      </h2>

      <p className='text-lg text-obsidian-muted'>
        {APP_CONFIG.DASHBOARD_CONTENT.WELCOME.DESCRIPTION}
      </p>

    </div>
  )
}

export default WelcomeSection