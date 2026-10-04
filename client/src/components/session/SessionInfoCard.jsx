import React from "react";
import { FaCheck, FaCopy } from "react-icons/fa";

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
    <div className="bg-[#1e1f22] rounded-2xl p-3 sm:p-4 border border-white/10 shadow-lg transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Room Key & Share Link */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-[#111214] px-3.5 py-1.5 rounded-xl border border-white/5">
            <span className="text-xs text-white/50 font-medium">Room Key:</span>
            <span className="font-mono font-bold text-obsidian-gold text-sm tracking-wider">{roomId}</span>
            <button
              onClick={onCopyRoomId}
              className="ml-1 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all text-xs"
              title="Copy Room ID"
            >
              {roomCopied ? <FaCheck className="w-3.5 h-3.5 text-obsidian-gold" /> : <FaCopy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-2 bg-[#111214] px-3.5 py-1.5 rounded-xl border border-white/5 max-w-full sm:max-w-xs">
            <span className="text-xs text-white/50 font-medium shrink-0">Invite:</span>
            <span className="text-xs text-white/80 truncate font-mono">{shareableLink}</span>
            <button
              onClick={onCopyLink}
              className="ml-1 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all text-xs shrink-0"
              title="Copy Invite Link"
            >
              {linkCopied ? <FaCheck className="w-3.5 h-3.5 text-obsidian-gold" /> : <FaCopy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Right: Status & Members Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 bg-[#111214] px-3 py-1.5 rounded-xl border border-white/5 text-xs">
            <span className="w-2 h-2 rounded-full bg-obsidian-gold"></span>
            <span className="text-white/60">Status:</span>
            <span className="font-bold text-white capitalize">{status}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#111214] px-3 py-1.5 rounded-xl border border-white/5 text-xs">
            <span className="text-white/60">Members:</span>
            <span className="font-bold text-obsidian-gold">{participantCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionInfoCard;
