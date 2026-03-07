import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom';
import { APP_CONFIG, ROUTES } from '../utils/constants';
import { FaVideo } from 'react-icons/fa';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate(ROUTES.HOME, { replace: true })
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className='fixed top-0 left-0 right-0 bg-obsidian-bg/80 backdrop-blur-md z-50 shadow-sm border-b border-obsidian-border'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    <Link
                        to={'/'}
                        className='flex items-center space-x-3 group'
                    >
                        <div className='relative w-10 h-10 rounded-[10px] overflow-hidden shadow-[0_0_10px_rgba(212,175,55,0.3)] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center'>
                            <img src="/logo.jpg" alt="Obsidian Conclave" className="absolute max-w-none w-[150%] h-[150%] object-cover pointer-events-none transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <h1 className='text-xl font-bold bg-gradient-to-r from-obsidian-gold to-obsidian-text bg-clip-text text-transparent'>
                            {APP_CONFIG.APP_NAME}
                        </h1>
                    </Link>

                    <nav className='flex items-center space-x-4'>
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-6 md:space-x-8">
                                <Link to={ROUTES.DASHBOARD} className='text-obsidian-text hover:text-obsidian-gold font-medium transition-colors'>
                                    Dashboard
                                </Link>
                                <Link to={ROUTES.SETTINGS} className='text-obsidian-muted hover:text-obsidian-gold font-medium transition-colors hidden md:block'>
                                    Settings
                                </Link>
                                <Link to={ROUTES.HELP} className='text-obsidian-muted hover:text-obsidian-gold font-medium transition-colors hidden md:block'>
                                    Help
                                </Link>
                                <Link to={ROUTES.TERMS} className='text-obsidian-muted hover:text-obsidian-gold font-medium transition-colors hidden lg:block'>
                                    Terms of Service
                                </Link>
                                <Link to={ROUTES.PRIVACY} className='text-obsidian-muted hover:text-obsidian-gold font-medium transition-colors hidden lg:block'>
                                    Privacy Policy
                                </Link>

                                {/* Separator */}
                                <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-obsidian-gold/60 to-transparent mx-2"></div>

                                {/* Profile Dropdown */}
                                <div className='relative ml-2' ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className='flex items-center justify-center rounded-lg hover:ring-2 hover:ring-obsidian-gold/50 transition-all focus:outline-none'
                                    >
                                        <div className='w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-inner overflow-hidden border border-obsidian-border'>
                                            {user?.profilePicture ? (
                                                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className='text-obsidian-gold text-sm font-bold'>
                                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                                </span>
                                            )}
                                        </div>
                                    </button>

                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-3 w-64 bg-obsidian-card/95 backdrop-blur-md border border-obsidian-border rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] py-1 z-50 transform origin-top-right overflow-hidden">
                                            <div className="px-5 py-4 text-center pb-5">
                                                <p className="text-base font-bold text-obsidian-text truncate">{user?.name}</p>
                                                <p className="text-xs text-obsidian-muted truncate mt-1">{user?.email}</p>
                                            </div>

                                            <div className="w-full h-px bg-gradient-to-r from-transparent via-obsidian-gold/60 to-transparent"></div>

                                            <div className="p-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className='w-full text-center px-5 py-2.5 text-sm text-destructive hover:text-red-400 hover:bg-destructive/10 transition-all duration-300 font-bold rounded-lg'
                                                >
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-6 md:space-x-8">
                                <a href="#features" className='text-obsidian-muted hover:text-obsidian-gold font-medium transition-colors hidden md:block' onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) }}>
                                    Features
                                </a>
                                <a href="#security" className='text-obsidian-muted hover:text-obsidian-gold font-medium transition-colors hidden md:block' onClick={(e) => { e.preventDefault(); document.getElementById('security')?.scrollIntoView({ behavior: 'smooth' }) }}>
                                    Security
                                </a>
                                <a href="#benefits" className='text-obsidian-muted hover:text-obsidian-gold font-medium transition-colors hidden md:block' onClick={(e) => { e.preventDefault(); document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' }) }}>
                                    Benefits
                                </a>
                                <a href="#platform" className='text-obsidian-muted hover:text-obsidian-gold font-medium transition-colors hidden md:block' onClick={(e) => { e.preventDefault(); document.getElementById('platform')?.scrollIntoView({ behavior: 'smooth' }) }}>
                                    Platform
                                </a>
                                <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-obsidian-gold/60 to-transparent"></div>
                                <div className="flex items-center space-x-4 md:space-x-6">
                                    <Link to={ROUTES.LOGIN} className='text-obsidian-text hover:text-obsidian-gold font-medium transition-colors'>
                                        Sign In
                                    </Link>
                                    <Link
                                        to={ROUTES.REGISTER}
                                        className='px-5 py-2.5 text-sm font-bold text-obsidian-bg bg-obsidian-gold rounded-lg hover:bg-obsidian-goldHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-obsidian-gold transition-colors shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            </div>
                        )}

                    </nav>

                </div>

            </div>
        </header>
    )
}

export default Header