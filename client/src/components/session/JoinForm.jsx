import React from "react";
import {
  FaArrowRight,
  FaExclamationCircle,
  FaHome,
  FaInfoCircle,
  FaSpinner,
  FaUsers,
} from "react-icons/fa";
import { APP_CONFIG } from "../../utils/constants";

const JoinForm = ({ roomId, error, loading, onChange, onSubmit }) => {
  return (
    <div className="max-w-2xl mx-auto bg-obsidian-card rounded-2xl shadow-2xl p-8 border border-obsidian-border/80 relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-64 h-64 bg-obsidian-gold rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-obsidian-gold to-obsidian-goldHover border border-obsidian-gold/30 rounded-2xl shadow-[0_0_15px_rgba(212,175,55,0.3)] mb-4">
          <FaUsers className="w-8 h-8 text-obsidian-bg" />
        </div>

        <h1 className="text-3xl font-bold text-obsidian-text mb-2 tracking-tight">
          {APP_CONFIG.SESSION_CONTENT.JOIN_FORM.HEADING}
        </h1>
        <p className=" text-obsidian-muted">
          {APP_CONFIG.SESSION_CONTENT.JOIN_FORM.DESCRIPTION}
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-obsidian-secondary/50 border-l-4 border-destructive text-destructive p-4 rounded-lg relative z-10">
          <div className="flex items-center">
            <FaExclamationCircle className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6 relative z-10">
        <div>
          <label
            htmlFor="roomId"
            className="block text-sm font-semibold text-obsidian-muted mb-3 uppercase tracking-wider"
          >
            {APP_CONFIG.SESSION_CONTENT.JOIN_FORM.ROOM_ID_LABEL}
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaHome className="h-6 w-6 text-obsidian-muted" />
            </div>

            <input
              id="roomId"
              type="text"
              value={roomId}
              onChange={onChange}
              maxLength={12}
              placeholder={
                APP_CONFIG.SESSION_CONTENT.JOIN_FORM.ROOM_ID_PLACEHOLDER
              }
              className="block w-full pl-12 pr-4 py-4 border border-obsidian-border bg-obsidian-secondary rounded-xl focus:ring-2 focus:ring-obsidian-gold focus:border-obsidian-gold text-center text-xl font-mono tracking-wider text-obsidian-text uppercase transition-colors outline-none placeholder-obsidian-muted/50"
            />
          </div>

          <p className="mt-3 text-sm text-obsidian-muted tracking-wide text-center">
            <FaInfoCircle className="w-4 h-4 inline mr-1 text-obsidian-gold" />
            {APP_CONFIG.SESSION_CONTENT.JOIN_FORM.ROOM_ID_HELP}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center py-4 px-6 bg-obsidian-gold hover:bg-obsidian-goldHover text-obsidian-bg rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.3)] text-lg font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-obsidian-bg focus:ring-obsidian-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-obsidian-bg" />
              {APP_CONFIG.SESSION_CONTENT.JOIN_FORM.BUTTON_LOADING}
            </>
          ) : (
            <>
              <FaArrowRight className="w-5 h-5 mr-3" />
              {APP_CONFIG.SESSION_CONTENT.JOIN_FORM.BUTTON}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default JoinForm;
