import React from "react";
import { APP_CONFIG } from "../utils/constants";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-obsidian-bg border-t border-obsidian-border text-obsidian-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="relative w-10 h-10 rounded-[10px] overflow-hidden shadow-[0_0_10px_rgba(212,175,55,0.3)] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center">
                <img src="/logo.jpg" alt="Obsidian Conclave" className="absolute max-w-none w-[150%] h-[150%] object-cover pointer-events-none transition-transform duration-500 group-hover:scale-105" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-obsidian-gold to-obsidian-text bg-clip-text text-transparent">
                {APP_CONFIG.APP_NAME}
              </h3>
            </div>
            <p className="text-obsidian-muted mb-4 max-w-md">
              {APP_CONFIG.APP_DESCRIPTION}
            </p>
          </div>

          <div>
            <h4 className="text-obsidian-text font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {APP_CONFIG.FOOTER_LINKS.QUICK_LINKS.map((link, index) => (
                <li key={index}>
                  {link.isExternal ? (
                    <a
                      href={link.route}
                      className="hover:text-obsidian-gold transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.route}
                      className="hover:text-obsidian-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-obsidian-text font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {APP_CONFIG.FOOTER_LINKS.SUPPORT_LINKS.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="hover:text-obsidian-gold transition-colors"
                    target={link.isExternal ? "_blank" : undefined}
                    rel={link.isExternal ? "noopener noreferrer" : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-obsidian-border mt-8 pt-8 text-center text-sm text-obsidian-muted">
          <p>
            &copy; {currentYear} {APP_CONFIG.APP_NAME}.{" "}
            {APP_CONFIG.COPYRIGHT_TEXT}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
