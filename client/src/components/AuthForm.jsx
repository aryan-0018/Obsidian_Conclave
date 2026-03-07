import React from "react";
import {
  FaEnvelope,
  FaExclamationCircle,
  FaLock,
  FaShieldAlt,
  FaSpinner,
  FaUser,
  FaUserPlus,
  FaVideo,
  FaArrowLeft,
} from "react-icons/fa";
import { APP_CONFIG, ROUTES } from "../utils/constants";
import { Link } from "react-router-dom";

const AuthForm = ({
  mode,
  formData,
  onChange,
  onSubmit,
  loading,
  error,
  localError,
}) => {
  const isLogin = mode === "login";
  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-obsidian-bg relative"
    >
      <Link
        to={ROUTES.HOME}
        className="absolute top-6 left-6 md:top-10 md:left-10 z-20 inline-flex items-center text-obsidian-muted hover:text-obsidian-gold transition-colors text-sm font-medium bg-black/40 px-4 py-2 rounded-lg border border-obsidian-border hover:border-obsidian-gold/40 backdrop-blur-sm shadow-lg"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </Link>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-obsidian-gold rounded-full mix-blend-screen filter blur-[120px] opacity-[0.05] pointer-events-none"></div>
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-[0_0_15px_rgba(212,175,55,0.15)] mb-4 bg-gradient-to-br from-obsidian-secondary to-[#222] border border-obsidian-gold/30"
          >
            {isLogin ? (
              <FaVideo className="w-8 h-8 text-obsidian-gold" />
            ) : (
              <FaUserPlus className="w-8 h-8 text-obsidian-gold" />
            )}
          </div>

          <h1 className="text-4xl font-bold text-obsidian-text mb-2">
            {isLogin ? APP_CONFIG.APP_NAME : `Join ${APP_CONFIG.APP_NAME}`}
          </h1>
          <p className="text-obsidian-muted">
            {isLogin
              ? APP_CONFIG.APP_TAGLINE
              : "Secure your place in the inner circle"}
          </p>
        </div>

        <div className="bg-obsidian-card/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-obsidian-border/80 relative overflow-hidden">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-obsidian-text text-center">
              {isLogin
                ? APP_CONFIG.AUTH_CONTENT.LOGIN.HEADING
                : APP_CONFIG.AUTH_CONTENT.REGISTER.HEADING}
            </h2>

            <p className="mt-2 text-center text-sm text-obsidian-muted">
              {isLogin
                ? APP_CONFIG.AUTH_CONTENT.LOGIN.DESCRIPTION
                : APP_CONFIG.AUTH_CONTENT.REGISTER.DESCRIPTION}
            </p>
          </div>

          <form
            className={isLogin ? "space-y-5 relative z-10" : "space-y-4 relative z-10"}
            onSubmit={onSubmit}
          >
            {(error || localError) && (
              <div className="bg-obsidian-secondary/50 border-l-4 border-destructive text-destructive p-4 rounded-lg flex items-start">
                <FaExclamationCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{error || localError}</span>
              </div>
            )}

            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-obsidian-text mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-obsidian-muted" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name || ""}
                    onChange={onChange}
                    className="block w-full pl-10 pr-3 py-3 bg-obsidian-secondary border border-obsidian-border rounded-lg text-obsidian-text placeholder-obsidian-muted focus:ring-2 focus:ring-obsidian-gold focus:border-obsidian-gold transition-colors outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-obsidian-text mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-obsidian-muted" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email || ""}
                  onChange={onChange}
                  className="block w-full pl-10 pr-3 py-3 bg-obsidian-secondary border border-obsidian-border rounded-lg text-obsidian-text placeholder-obsidian-muted focus:ring-2 focus:ring-obsidian-gold focus:border-obsidian-gold transition-colors outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>


            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-obsidian-text mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-obsidian-muted" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  required
                  value={formData.password || ""}
                  onChange={onChange}
                  className="block w-full pl-10 pr-3 py-3 bg-obsidian-secondary border border-obsidian-border rounded-lg text-obsidian-text placeholder-obsidian-muted focus:ring-2 focus:ring-obsidian-gold focus:border-obsidian-gold transition-colors outline-none"
                  placeholder={isLogin ? 'Enter your password' : 'Minimum 6 characters'}
                />
              </div>
            </div>


            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-obsidian-text mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaShieldAlt className="h-5 w-5 text-obsidian-muted" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete='new-password'
                    required
                    value={formData.confirmPassword || ""}
                    onChange={onChange}
                    className="block w-full pl-10 pr-3 py-3 bg-obsidian-secondary border border-obsidian-border rounded-lg text-obsidian-text placeholder-obsidian-muted focus:ring-2 focus:ring-obsidian-gold focus:border-obsidian-gold transition-colors outline-none"
                    placeholder='Re-enter your password'
                  />
                </div>
              </div>
            )}


            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-obsidian-bg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-obsidian-bg focus:ring-obsidian-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] bg-obsidian-gold hover:bg-obsidian-goldHover shadow-[0_0_15px_rgba(212,175,55,0.15)] ${!isLogin && 'mt-6'}`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  {isLogin ? 'Signing...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center relative z-10">
            <p className="text-sm text-obsidian-muted">
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <Link to={ROUTES.REGISTER} className="font-semibold text-obsidian-gold hover:text-obsidian-goldHover transition-colors">
                    Create one now
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Link to={ROUTES.LOGIN} className="font-semibold text-obsidian-gold hover:text-obsidian-goldHover transition-colors">
                    Sign in here
                  </Link>
                </>
              )}

            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
