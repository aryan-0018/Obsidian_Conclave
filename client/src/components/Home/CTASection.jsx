import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { APP_CONFIG, ROUTES } from '../../utils/constants';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const CTASection = () => {
  const { isAuthenticated } = useAuth();
  return (
    <section id="platform" className='py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-obsidian-secondary via-[#151515] to-[#050505] border-y border-obsidian-border relative'>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      <div className='max-w-4xl mx-auto text-center relative z-10'>
        <h2 className='text-4xl md:text-5xl font-bold text-obsidian-text mb-6'>
          {APP_CONFIG.HOME_CONTENT.CTA.HEADING}
        </h2>

        <p className='text-xl text-obsidian-muted mb-10'>
          {APP_CONFIG.HOME_CONTENT.CTA.DESCRIPTION.replace('{APP_NAME}', APP_CONFIG.APP_NAME)}
        </p>

        {isAuthenticated ? (
          <Link to={ROUTES.DASHBOARD}
            className='inline-flex items-center px-8 py-4 bg-obsidian-gold text-obsidian-bg rounded-xl hover:bg-obsidian-goldHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-obsidian-bg focus:ring-obsidian-gold font-bold text-lg shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all transform hover:scale-105 '
          >
            {APP_CONFIG.HOME_CONTENT.CTA.BUTTON_AUTHENTICATED}
            <FaArrowRight className='ml-2' />
          </Link>
        ) : (
          <Link to={ROUTES.REGISTER}
            className='inline-flex items-center px-8 py-4 bg-obsidian-gold text-obsidian-bg rounded-xl hover:bg-obsidian-goldHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-obsidian-bg focus:ring-obsidian-gold font-bold text-lg shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all transform hover:scale-105 '
          >
            {APP_CONFIG.HOME_CONTENT.CTA.BUTTON_GUEST}
            <FaArrowRight className='ml-2' />
          </Link>
        )}

      </div>
    </section>
  )
}

export default CTASection