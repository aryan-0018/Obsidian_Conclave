import React from "react";
import { useAuth } from "../../context/AuthContext";
import { FaArrowRight, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import { APP_CONFIG, ROUTES } from "../../utils/constants";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-obsidian-bg overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-obsidian-gold rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-obsidian-goldHover rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-obsidian-gold rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-obsidian-gold/10 border border-obsidian-gold/30 rounded-full text-obsidian-gold text-sm font-medium mb-8">
            <FaShieldAlt className="w-4 h-4 mr-2" />
            {APP_CONFIG.HOME_CONTENT.HERO.BADGE_TEXT}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-obsidian-text mb-2 tracking-wide">
            {APP_CONFIG.HOME_CONTENT.HERO.HEADING}{" "}
            <span className="bg-gradient-to-r from-obsidian-gold to-[#96763d] bg-clip-text text-transparent">
              {APP_CONFIG.HOME_CONTENT.HERO.HEADING_HIGHLIGHT}
            </span>
          </h1>
          <h2 className="text-xl md:text-2xl font-light text-obsidian-gold mb-8 italic opacity-80">
            For conversations that matter.
          </h2>

          <p className="text-lg md:text-xl text-obsidian-muted mb-10 max-w-3xl mx-auto leading-relaxed">
            {APP_CONFIG.HOME_CONTENT.HERO.SUBHEADING}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <Link
                to={ROUTES.DASHBOARD}
                className="px-8 py-4 bg-gradient-to-r from-obsidian-gold to-obsidian-goldHover text-obsidian-bg rounded-xl hover:from-obsidian-goldHover hover:to-obsidian-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-obsidian-bg focus:ring-obsidian-gold font-semibold text-lg transition-all transform hover:scale-105 flex items-center shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                {APP_CONFIG.HOME_CONTENT.HERO.CTA_AUTHENTICATED}
                <FaArrowRight className="ml-2" />
              </Link>
            ) : (
              <>
                <Link
                  to={ROUTES.REGISTER}
                  className="px-8 py-4 bg-gradient-to-r from-obsidian-gold to-obsidian-goldHover text-obsidian-bg rounded-xl hover:from-obsidian-goldHover hover:to-obsidian-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-obsidian-bg focus:ring-obsidian-gold font-semibold text-lg transition-all transform hover:scale-105 flex items-center shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                >
                  {APP_CONFIG.HOME_CONTENT.HERO.CTA_PRIMARY}
                  <FaArrowRight className="ml-2" />
                </Link>

                <Link
                  to={ROUTES.LOGIN}
                  className="px-8 py-4 bg-transparent text-obsidian-text border-2 border-obsidian-border rounded-xl hover:border-obsidian-gold hover:text-obsidian-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-obsidian-bg focus:ring-obsidian-gold font-semibold text-lg transition-all "
                >
                  {APP_CONFIG.HOME_CONTENT.HERO.CTA_SECONDARY}
                </Link>


              </>
            )}
          </div>

          <div id="security" className="mt-12 flex flex-wrap justify-center items-center gap-8 text-obsidian-muted pt-8">
            {APP_CONFIG.TRUST_INDICATORS.map((indicator, index) => (
              <div key={index} className="flex items-center">
                <FaCheckCircle className="w-5 h-5 text-obsidian-gold mr-2" />
                <span>{indicator}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
