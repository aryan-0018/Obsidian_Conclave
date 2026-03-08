import React from "react";
import { FaPlus, FaSpinner, FaUsers, FaGlobe, FaLock } from "react-icons/fa";
import { APP_CONFIG } from "../../utils/constants";

const ActionCard = ({ onCreateSession, onJoinSession, creating, meetingType, onMeetingTypeChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div className="bg-obsidian-card rounded-2xl shadow-lg p-8 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all transform hover:-translate-y-1 border border-obsidian-border hover:border-obsidian-gold/30">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-obsidian-gold to-obsidian-goldHover rounded-xl mb-6 mx-auto shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          <FaPlus className="w-8 h-8 text-obsidian-bg" />
        </div>
        <h3 className="text-2xl font-bold text-obsidian-text mb-3 text-center">
          {APP_CONFIG.DASHBOARD_CONTENT.ACTION_CARDS.HOST.TITLE}
        </h3>
        <p className="text-obsidian-muted mb-5 text-center">
          {APP_CONFIG.DASHBOARD_CONTENT.ACTION_CARDS.HOST.DESCRIPTION}
        </p>

        {/* Meeting Type Selector */}
        <div className="mb-5">
          <div className="flex rounded-lg border border-obsidian-border overflow-hidden">
            <button
              type="button"
              onClick={() => onMeetingTypeChange?.('public')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-bold transition-all ${meetingType !== 'private'
                  ? 'bg-obsidian-gold text-obsidian-bg'
                  : 'bg-obsidian-secondary text-obsidian-muted hover:text-obsidian-text'
                }`}
            >
              <FaGlobe className="w-3.5 h-3.5" />
              {APP_CONFIG.SESSION_CONTENT.MEETING_TYPE.PUBLIC_LABEL}
            </button>
            <button
              type="button"
              onClick={() => onMeetingTypeChange?.('private')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-bold transition-all ${meetingType === 'private'
                  ? 'bg-obsidian-gold text-obsidian-bg'
                  : 'bg-obsidian-secondary text-obsidian-muted hover:text-obsidian-text'
                }`}
            >
              <FaLock className="w-3.5 h-3.5" />
              {APP_CONFIG.SESSION_CONTENT.MEETING_TYPE.PRIVATE_LABEL}
            </button>
          </div>
          <p className="text-xs text-obsidian-muted mt-2 text-center">
            {meetingType === 'private'
              ? APP_CONFIG.SESSION_CONTENT.MEETING_TYPE.PRIVATE_DESC
              : APP_CONFIG.SESSION_CONTENT.MEETING_TYPE.PUBLIC_DESC
            }
          </p>
        </div>

        <button
          onClick={onCreateSession}
          disabled={creating}
          className="w-full px-6 py-3 bg-gradient-to-r from-obsidian-gold to-obsidian-goldHover text-obsidian-bg rounded-lg hover:from-obsidian-goldHover hover:to-obsidian-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-obsidian-bg focus:ring-obsidian-gold disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all transform hover:scale-[1.02] shadow-[0_0_15px_rgba(212,175,55,0.2)]"
        >
          {creating ? (
            <span className="flex items-center justify-center">
              <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              {APP_CONFIG.DASHBOARD_CONTENT.ACTION_CARDS.HOST.BUTTON_LOADING}
            </span>
          ) : (
            APP_CONFIG.DASHBOARD_CONTENT.ACTION_CARDS.HOST.BUTTON
          )}
        </button>
      </div>

      <div className="bg-obsidian-card rounded-2xl shadow-lg p-8 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all transform hover:-translate-y-1 border border-obsidian-border hover:border-obsidian-gold/30">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-obsidian-secondary to-[#222] border border-obsidian-border rounded-xl mb-6 mx-auto">
          <FaUsers className="w-8 h-8 text-obsidian-gold" />
        </div>

        <h3 className="text-2xl font-bold text-obsidian-text mb-3 text-center">
          {APP_CONFIG.DASHBOARD_CONTENT.ACTION_CARDS.JOIN.TITLE}
        </h3>
        <p className="text-obsidian-muted mb-6 text-center">
          {APP_CONFIG.DASHBOARD_CONTENT.ACTION_CARDS.JOIN.DESCRIPTION}
        </p>

        <button
          onClick={onJoinSession}
          className="w-full px-6 py-3 bg-transparent border-2 border-obsidian-gold text-obsidian-gold rounded-lg hover:bg-obsidian-gold hover:text-obsidian-bg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-obsidian-bg focus:ring-obsidian-gold disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all transform hover:scale-[1.02]"
        >
          {APP_CONFIG.DASHBOARD_CONTENT.ACTION_CARDS.JOIN.BUTTON}
        </button>
      </div>
    </div>
  );
};

export default ActionCard;
