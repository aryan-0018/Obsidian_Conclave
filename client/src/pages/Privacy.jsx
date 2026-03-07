import React from 'react';

const Privacy = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 text-obsidian-text">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-obsidian-gold to-obsidian-goldHover bg-clip-text text-transparent mb-6">
                Privacy Policy
            </h1>
            <div className="bg-obsidian-card p-8 rounded-xl border border-obsidian-border shadow-lg space-y-6 text-obsidian-muted">
                <p>
                    At Obsidian Conclave, discretion is our paramount directive. This document outlines our unwavering commitment to your privacy.
                </p>
                <h2 className="text-2xl font-bold text-obsidian-text mt-8">Data Collection</h2>
                <p>
                    We collect only the essential cryptographic signatures required to authenticate sessions. We do not store, process, or sell user telemetry data.
                </p>
                <h2 className="text-2xl font-bold text-obsidian-text mt-8">Zero-Knowledge Architecture</h2>
                <p>
                    All video, audio, and chat streams are secured via end-to-end encryption. Our servers facilitate the connection but cannot decrypt the contents of your conclave.
                </p>
            </div>
        </div>
    );
};

export default Privacy;
