import React from 'react';
import { FaVideo, FaHome, FaShieldAlt } from 'react-icons/fa';

const Help = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 text-obsidian-text">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-obsidian-gold to-obsidian-goldHover bg-clip-text text-transparent mb-6">
                Help & Instructions
            </h1>
            <div className="bg-obsidian-card p-8 rounded-xl border border-obsidian-border shadow-lg space-y-8">
                <p className="text-obsidian-muted text-lg">
                    Welcome to Obsidian Conclave. Here is a guide on how to navigate and utilize our exclusive encrypted communication platform.
                </p>

                <div className="bg-obsidian-bg p-6 rounded-lg border border-obsidian-border/50">
                    <div className="flex items-center mb-4">
                        <FaVideo className="text-obsidian-gold w-6 h-6 mr-3" />
                        <h2 className="text-2xl font-bold">Commencing a Conclave</h2>
                    </div>
                    <ol className="list-decimal list-inside space-y-3 text-obsidian-muted ml-2">
                        <li>Navigate to your <strong>Dashboard</strong>.</li>
                        <li>Select <span className="text-obsidian-text font-semibold">Commence Session</span> from the action cards.</li>
                        <li>A secure room will be generated. Copy the <strong>Access Key (Room ID)</strong> or shareable link.</li>
                        <li>Distribute this key to your distinguished guests via secure channels.</li>
                        <li>Once ready, your session is fully encrypted and live.</li>
                    </ol>
                </div>

                <div className="bg-obsidian-bg p-6 rounded-lg border border-obsidian-border/50">
                    <div className="flex items-center mb-4">
                        <FaHome className="text-obsidian-gold w-6 h-6 mr-3" />
                        <h2 className="text-2xl font-bold">Joining a Conclave</h2>
                    </div>
                    <ol className="list-decimal list-inside space-y-3 text-obsidian-muted ml-2">
                        <li>Obtain the <strong>Access Key (Room ID)</strong> from your host.</li>
                        <li>Navigate to the <strong>Dashboard</strong> or use the direct join link.</li>
                        <li>Select <span className="text-obsidian-text font-semibold">Join Session</span>.</li>
                        <li>Enter the Access Key to authenticate your entry.</li>
                        <li>You will be securely connected to the ongoing conclave.</li>
                    </ol>
                </div>

                <div className="bg-obsidian-bg p-6 rounded-lg border border-obsidian-border/50">
                    <div className="flex items-center mb-4">
                        <FaShieldAlt className="text-obsidian-gold w-6 h-6 mr-3" />
                        <h2 className="text-2xl font-bold">Security & Profile</h2>
                    </div>
                    <p className="text-obsidian-muted mb-3">
                        Your profile settings and active sessions can be managed via the dropdown in the top right corner of the navigation bar.
                    </p>
                    <p className="text-obsidian-muted">
                        All communications are protected with AES-256-GCM encryption. If you require further assistance or suspect a security breach, please contact your administrator immediately.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Help;
