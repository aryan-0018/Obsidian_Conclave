import React from 'react'
import { APP_CONFIG } from '../../utils/constants'
import { FaCheckCircle, FaVideo } from 'react-icons/fa';

const BenefitsSection = () => {
  const benefits = APP_CONFIG.BENEFITS;
  return (
    <section id="benefits" className='py-20 px-4 sm:px-6 lg:px-8 bg-obsidian-bg relative'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>

          <div className='relative'>
            <div className='bg-gradient-to-br from-obsidian-secondary to-[#222222] border border-obsidian-border rounded-2xl p-8 shadow-2xl relative z-10'>
              <div className='aspect-video bg-obsidian-bg/50 rounded-lg backdrop-blur-sm flex items-center justify-center border border-obsidian-gold/20'>
                <FaVideo className='w-24 h-24 text-obsidian-gold opacity-80 filter drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]' />

              </div>

            </div>
            <div className='absolute -top-4 -right-4 w-24 h-24 bg-obsidian-gold rounded-full opacity-20 blur-2xl'></div>
            <div className='absolute -bottom-4 -left-4 w-24 h-24 bg-obsidian-goldHover rounded-full opacity-20 blur-2xl'></div>
          </div>

          <div>
            <h2 className='text-4xl font-bold text-obsidian-text mb-6'>
              {APP_CONFIG.HOME_CONTENT.BENEFITS.HEADING.replace('{APP_NAME}', APP_CONFIG.APP_NAME)}

            </h2>
            <p className='text-xl text-obsidian-muted mb-8'>
              {APP_CONFIG.HOME_CONTENT.BENEFITS.DESCRIPTION}
            </p>
            <ul className='space-y-4'>
              {benefits.map((benefit, index) => (
                <li key={index} className='flex items-center group'>
                  <FaCheckCircle className='w-6 h-6 text-obsidian-gold mr-3 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform' />
                  <span className='text-lg text-gray-300'>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </section>
  )
}

export default BenefitsSection