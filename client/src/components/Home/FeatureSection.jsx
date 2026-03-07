import React from 'react'
import { APP_CONFIG } from '../../utils/constants'
import { FaComments, FaShieldAlt, FaUsers, FaVideo } from 'react-icons/fa'


const iconMap = {
    FaVideo: FaVideo,
    FaComments: FaComments,
    FaShieldAlt: FaShieldAlt,
    FaUsers: FaUsers
}

const FeatureSection = () => {
    return (
        <section id="features" className='py-20 px-4 sm:px-6 lg:px-8 bg-obsidian-bg relative'>
            <div className='max-w-7xl mx-auto'>
                <div className='text-center mb-16 relative z-10'>
                    <h2 className='text-4xl font-bold text-obsidian-text mb-4'>
                        {APP_CONFIG.HOME_CONTENT.FEATURES.HEADING}
                    </h2>
                    <p className='text-xl text-obsidian-muted max-w-2xl mx-auto'>
                        {APP_CONFIG.HOME_CONTENT.FEATURES.DESCRIPTION}

                    </p>



                </div>


                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10'>
                    {APP_CONFIG.FEATURES.map((feature, index) => {
                        const IconComponent = iconMap[feature.icon];
                        return (
                            <div key={index} className='bg-obsidian-card rounded-2xl p-8 shadow-lg border border-obsidian-border hover:border-obsidian-gold/50 transition-all transform hover:-translate-y-2 group'>
                                <div className={`w-16 h-16 bg-gradient-to-br from-obsidian-gold to-obsidian-goldHover rounded-xl flex items-center justify-center text-obsidian-bg mb-6 shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all`}>
                                    {IconComponent && <IconComponent className='w-8 h-8' />}
                                </div>
                                <h3 className='text-xl font-bold text-obsidian-text mb-3'>
                                    {feature.title}
                                </h3>
                                <p className='text-obsidian-muted'>
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}

                </div>

            </div>

        </section>
    )
}

export default FeatureSection