import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { APP_CONFIG, ROUTES } from '../utils/constants';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate(ROUTES.HOME, { replace: true })
    }

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);
    }, [location.pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-btn')) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

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

                    {/* Desktop Navigation */}
                    <nav className='hidden md:flex items-center space-x-4'>
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-6 md:space-x-8">
                                <Link to={ROUTES.DASHBOARD} className='text-obsidian-text hover:text-obsidian-gold font-medium transition-colors'>
                                    Dashboard
                                </Link>
                                <Link to={ROUTES.SETTINGS} className='text-obsidian-muted hover:text-obsidian-gold font-medium transition-colors'>
                                    Settings
                                </Link>
                                <Link to={ROUTES.HELP} className='text-obsidian-muted hover:text-obsidian-gold font-medium transition-colors'>
                                    Help
                                </Link>
                                <Link to={ROUTES.TERMS} className='text-obsidian-muted hover:text-obsidian-gold font-medium transition-colors hidden lg:block'>
                                    Terms of Service
                                </Link>
                                <Link to={ROUTES.PRIVACY} className='text-obsidian-muted hover:text-obsidian-gold font-medium transition-colors hidden lg:block'>
                                    Privacy Policy
                                </Link>

                                {/* Separator */}
                                <div className="w-px h-8 bg-gradient-to-b from-transparent via-obsidian-gold/60 to-transparent mx-2"></div>

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
                                <a href="#features" className='text-obsidian-muted hover:text-obsidian-gold font-medium transition-colors' onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) }}>
                                    Features
                                </a>
                                <a href="#security" className='text-obsidian-muted hover:text-obsidian-gold font-medium transition-colors' onClick={(e) => { e.preventDefault(); document.getElementById('security')?.scrollIntoView({ behavior: 'smooth' }) }}>
                                    Security
                                </a>
                                <a href="#benefits" className='text-obsidian-muted hover:text-obsidian-gold font-medium transition-colors' onClick={(e) => { e.preventDefault(); document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' }) }}>
                                    Benefits
                                </a>
                                <a href="#platform" className='text-obsidian-muted hover:text-obsidian-gold font-medium transition-colors' onClick={(e) => { e.preventDefault(); document.getElementById('platform')?.scrollIntoView({ behavior: 'smooth' }) }}>
                                    Platform
                                </a>
                                <div className="w-px h-8 bg-gradient-to-b from-transparent via-obsidian-gold/60 to-transparent"></div>
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

                    {/* Mobile Menu Button */}
                    <button
                        className='mobile-menu-btn md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-obsidian-muted hover:text-obsidian-gold hover:bg-obsidian-secondary transition-all focus:outline-none'
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <FaTimes className="w-5 h-5" />
                        ) : (
                            <FaBars className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay + Drawer */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="md:hidden fixed inset-0 top-16 bg-black/60 backdrop-blur-sm z-40"
                        onClick={closeMobileMenu}
                    />

                    {/* Menu Panel */}
                    <div
                        ref={mobileMenuRef}
                        className="md:hidden fixed top-16 left-0 right-0 bg-obsidian-card/95 backdrop-blur-md border-b border-obsidian-border z-50 shadow-[0_10px_40px_rgba(0,0,0,0.6)] max-h-[calc(100vh-4rem)] overflow-y-auto animate-slideDown"
                    >
                        <nav className="px-4 py-4 space-y-1">
                            {isAuthenticated ? (
                                <>
                                    {/* User info */}
                                    <div className="flex items-center space-x-3 px-3 py-3 mb-2 bg-obsidian-secondary/50 rounded-lg border border-obsidian-border/50">
                                        <div className='w-9 h-9 bg-black rounded-lg flex items-center justify-center shadow-inner overflow-hidden border border-obsidian-border'>
                                            {user?.profilePicture ? (
                                                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className='text-obsidian-gold text-sm font-bold'>
                                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-obsidian-text truncate">{user?.name}</p>
                                            <p className="text-xs text-obsidian-muted truncate">{user?.email}</p>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-obsidian-border to-transparent my-2"></div>

                                    <Link to={ROUTES.DASHBOARD} onClick={closeMobileMenu} className='block px-3 py-3 text-obsidian-text hover:text-obsidian-gold hover:bg-obsidian-secondary/50 font-medium transition-colors rounded-lg'>
                                        Dashboard
                                    </Link>
                                    <Link to={ROUTES.SETTINGS} onClick={closeMobileMenu} className='block px-3 py-3 text-obsidian-muted hover:text-obsidian-gold hover:bg-obsidian-secondary/50 font-medium transition-colors rounded-lg'>
                                        Settings
                                    </Link>
                                    <Link to={ROUTES.HELP} onClick={closeMobileMenu} className='block px-3 py-3 text-obsidian-muted hover:text-obsidian-gold hover:bg-obsidian-secondary/50 font-medium transition-colors rounded-lg'>
                                        Help
                                    </Link>
                                    <Link to={ROUTES.TERMS} onClick={closeMobileMenu} className='block px-3 py-3 text-obsidian-muted hover:text-obsidian-gold hover:bg-obsidian-secondary/50 font-medium transition-colors rounded-lg'>
                                        Terms of Service
                                    </Link>
                                    <Link to={ROUTES.PRIVACY} onClick={closeMobileMenu} className='block px-3 py-3 text-obsidian-muted hover:text-obsidian-gold hover:bg-obsidian-secondary/50 font-medium transition-colors rounded-lg'>
                                        Privacy Policy
                                    </Link>

                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-obsidian-border to-transparent my-2"></div>

                                    <button
                                        onClick={handleLogout}
                                        className='w-full text-left px-3 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 font-bold transition-colors rounded-lg'
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <a href="#features" className='block px-3 py-3 text-obsidian-muted hover:text-obsidian-gold hover:bg-obsidian-secondary/50 font-medium transition-colors rounded-lg' onClick={(e) => { e.preventDefault(); closeMobileMenu(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>
                                        Features
                                    </a>
                                    <a href="#security" className='block px-3 py-3 text-obsidian-muted hover:text-obsidian-gold hover:bg-obsidian-secondary/50 font-medium transition-colors rounded-lg' onClick={(e) => { e.preventDefault(); closeMobileMenu(); document.getElementById('security')?.scrollIntoView({ behavior: 'smooth' }); }}>
                                        Security
                                    </a>
                                    <a href="#benefits" className='block px-3 py-3 text-obsidian-muted hover:text-obsidian-gold hover:bg-obsidian-secondary/50 font-medium transition-colors rounded-lg' onClick={(e) => { e.preventDefault(); closeMobileMenu(); document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' }); }}>
                                        Benefits
                                    </a>
                                    <a href="#platform" className='block px-3 py-3 text-obsidian-muted hover:text-obsidian-gold hover:bg-obsidian-secondary/50 font-medium transition-colors rounded-lg' onClick={(e) => { e.preventDefault(); closeMobileMenu(); document.getElementById('platform')?.scrollIntoView({ behavior: 'smooth' }); }}>
                                        Platform
                                    </a>

                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-obsidian-border to-transparent my-2"></div>

                                    <Link to={ROUTES.LOGIN} onClick={closeMobileMenu} className='block px-3 py-3 text-obsidian-text hover:text-obsidian-gold hover:bg-obsidian-secondary/50 font-medium transition-colors rounded-lg'>
                                        Sign In
                                    </Link>
                                    <Link
                                        to={ROUTES.REGISTER}
                                        onClick={closeMobileMenu}
                                        className='block mx-3 mt-2 px-5 py-3 text-sm font-bold text-obsidian-bg bg-obsidian-gold rounded-lg hover:bg-obsidian-goldHover text-center transition-colors shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </>
            )}
        </header>
    )
}

export default Header