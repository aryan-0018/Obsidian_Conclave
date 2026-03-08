import React from "react";
import { APP_CONFIG } from "../../utils/constants";
import { FaCircle, FaExternalLinkAlt, FaSpinner } from "react-icons/fa";
import { formatDate, getDuration } from "../../utils/helpers";

const SessionList = ({
  sessions,
  loading,
  statusFilter,
  onFilterChange,
  onRejoinSession,
}) => {
  const statusBadge = (status) => {
    const map = {
      active: "bg-obsidian-gold/10 text-obsidian-gold border border-obsidian-gold/30",
      ended: "bg-obsidian-secondary text-obsidian-muted border border-obsidian-border",
    };
    return map[status] || "bg-obsidian-secondary text-obsidian-muted border border-obsidian-border";
  };


  return (
    <div className="mt-16 max-w-5xl mx-auto bg-obsidian-card rounded-2xl shadow-lg border border-obsidian-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h3 className="text-2xl text-obsidian-text font-bold">
            {APP_CONFIG.DASHBOARD_CONTENT.SESSIONS_LIST.HEADING}
          </h3>
          <p className="text-obsidian-muted mt-1">
            {APP_CONFIG.DASHBOARD_CONTENT.SESSIONS_LIST.DESCRIPTION}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <label className="text-sm text-obsidian-muted">Filter:</label>
          <select
            value={statusFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="py-2 px-3 bg-obsidian-secondary text-obsidian-text border border-obsidian-border rounded-lg focus:outline-none focus:ring-2 focus:ring-obsidian-gold focus:border-obsidian-gold"
          >
            <option value="all">
              {APP_CONFIG.DASHBOARD_CONTENT.SESSIONS_LIST.FILTER_ALL}
            </option>
            <option value="active">
              {APP_CONFIG.DASHBOARD_CONTENT.SESSIONS_LIST.FILTER_ACTIVE}
            </option>
            <option value="ended">
              {APP_CONFIG.DASHBOARD_CONTENT.SESSIONS_LIST.FILTER_ENDED}
            </option>
          </select>
        </div>
      </div>

      {loading && sessions.length === 0 ? (
        <div className="flex items-center text-obsidian-gold justify-center py-8">
          <FaSpinner className="animate-spin h-5 w-5 mr-3" />
          {APP_CONFIG.DASHBOARD_CONTENT.SESSIONS_LIST.LOADING}
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-obsidian-muted text-center py-8 border border-dashed border-obsidian-border rounded-xl">
          {APP_CONFIG.DASHBOARD_CONTENT.SESSIONS_LIST.EMPTY}
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="border border-obsidian-border bg-obsidian-secondary/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-obsidian-gold/30 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all"
            >
              <div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(s.status)} `}
                  >
                    <FaCircle className="w-2 h-2 mr-2" />
                    <span className="capitalize">{s.status}</span>
                  </span>
                  {s.isHost && (
                    <span className="text-xs font-semibold text-obsidian-bg bg-obsidian-gold px-2 py-1 rounded-full">
                      Host
                    </span>
                  )}
                </div>
                <div className="mt-3 text-lg font-semibold text-obsidian-text">
                  Room: <span className="font-mono text-obsidian-gold">{s.roomId}</span>
                </div>
                <div className="text-sm text-obsidian-muted mt-1">
                  Host: <span className="text-[#dcd6cb]">{s.hostName}</span>
                </div>
                <div className="text-sm text-obsidian-muted ">
                  Participants: <span className="text-[#dcd6cb]">{s.participantCount}</span>
                </div>
                <div className="text-sm text-obsidian-muted/80 mt-2">
                  Started: {s.startedAt ? formatDate(s.startedAt) : "N/A"}
                  {s.endedAt && (
                    <div className="mt-1">
                      Ended: {formatDate(s.endedAt)}
                      <span className="ml-2 px-2 py-0.5 bg-obsidian-secondary border border-obsidian-border rounded text-xs font-mono text-obsidian-gold">
                        Duration: {getDuration(s.startedAt, s.endedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onRejoinSession(s)}
                  disabled={s.status !== "active"}
                  className="inline-flex items-center px-4 py-2 bg-obsidian-gold text-obsidian-bg rounded-lg hover:bg-obsidian-goldHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-obsidian-bg focus:ring-obsidian-gold disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors shadow-sm"
                >
                  {s.status === "active" ? (
                    <>
                      {APP_CONFIG.DASHBOARD_CONTENT.SESSIONS_LIST.REJOIN_BUTTON}
                      <FaExternalLinkAlt className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    APP_CONFIG.DASHBOARD_CONTENT.SESSIONS_LIST.ENDED_BUTTON
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionList;
