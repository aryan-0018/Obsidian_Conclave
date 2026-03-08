import React from "react";
import { FaCheck, FaCopy, FaInfoCircle } from "react-icons/fa";
import { APP_CONFIG } from "../../utils/constants";

const SessionInfoCard = ({
  roomId,
  shareableLink,
  status,
  participantCount,
  roomCopied,
  linkCopied,
  onCopyRoomId,
  onCopyLink,
}) => {
  return (
    <div className="bg-obsidian-card rounded-xl shadow-lg p-4 sm:p-6 border border-obsidian-border">
      <div className="flex items-center mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-obsidian-gold to-obsidian-goldHover rounded-lg flex items-center justify-center mr-3 shadow-[0_0_10px_rgba(212,175,55,0.3)] flex-shrink-0">
          <FaInfoCircle className="w-4 h-4 sm:w-6 sm:h-6 text-obsidian-bg" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-obsidian-text">
          {APP_CONFIG.SESSION_CONTENT.INFO_CARD.HEADING}
        </h2>
      </div>

      {/* Room ID */}
      <div className="mb-4 sm:mb-5">
        <label className="block text-sm font-semibold text-obsidian-muted mb-2">
          {APP_CONFIG.SESSION_CONTENT.INFO_CARD.ROOM_ID_LABEL}
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={roomId}
              readOnly
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-obsidian-border rounded-lg bg-obsidian-secondary font-mono text-base sm:text-lg tracking-wider text-center text-obsidian-gold focus:border-obsidian-gold outline-none transition-colors"
            />
          </div>
          <button
            onClick={onCopyRoomId}
            className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-bold transition-all flex-shrink-0 ${roomCopied ? "bg-green-600 text-obsidian-bg" : "bg-obsidian-gold text-obsidian-bg hover:bg-obsidian-goldHover shadow-[0_0_10px_rgba(212,175,55,0.2)]"}`}
          >
            {roomCopied ? (
              <span className="flex items-center justify-center">
                <FaCheck className="w-4 h-4 mr-1" />
                {APP_CONFIG.SESSION_CONTENT.INFO_CARD.COPIED_BUTTON}
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <FaCopy className="w-4 h-4 mr-1" />
                {APP_CONFIG.SESSION_CONTENT.INFO_CARD.COPY_BUTTON}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Shareable Link */}
      <div className="mb-4 sm:mb-5">
        <label className="block text-sm font-semibold text-obsidian-muted mb-2">
          {APP_CONFIG.SESSION_CONTENT.INFO_CARD.SHAREABLE_LINK_LABEL}
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            value={shareableLink}
            readOnly
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-obsidian-border rounded-lg bg-obsidian-secondary text-sm text-obsidian-text focus:border-obsidian-gold outline-none transition-colors truncate"
          />
          <button
            onClick={onCopyLink}
            className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-bold transition-all flex-shrink-0 ${linkCopied ? "bg-green-600 text-obsidian-bg" : "bg-obsidian-gold text-obsidian-bg hover:bg-obsidian-goldHover shadow-[0_0_10px_rgba(212,175,55,0.2)]"}`}
          >
            {linkCopied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Status grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-5 border-t border-obsidian-border">
        <div className="bg-obsidian-secondary p-3 sm:p-4 rounded-lg border border-obsidian-gold/20">
          <p className="text-xs font-semibold text-obsidian-gold uppercase tracking-wide mb-1">
            {APP_CONFIG.SESSION_CONTENT.INFO_CARD.STATUS_LABEL}
          </p>
          <p className="text-lg sm:text-xl font-bold text-green-500 capitalize">
            {status}
          </p>
        </div>

        <div className="bg-obsidian-secondary p-3 sm:p-4 rounded-lg border border-obsidian-gold/20">
          <p className="text-xs font-semibold text-obsidian-gold uppercase tracking-wide mb-1">
            {APP_CONFIG.SESSION_CONTENT.INFO_CARD.PARTICIPANTS_LABEL}
          </p>
          <p className="text-lg sm:text-xl font-bold text-obsidian-text capitalize">
            {participantCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionInfoCard;
