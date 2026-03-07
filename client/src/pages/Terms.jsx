import React from 'react';

const Terms = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 text-obsidian-text">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-obsidian-gold to-obsidian-goldHover bg-clip-text text-transparent mb-6">
                Terms of Service
            </h1>
            <div className="bg-obsidian-card p-8 rounded-xl border border-obsidian-border shadow-lg space-y-6 text-obsidian-muted">
                <p>
                    By accessing Obsidian Conclave, you agree to adhere to strict communication protocols and maintain the integrity of the platform.
                </p>
                <h2 className="text-2xl font-bold text-obsidian-text mt-8">Acceptable Use</h2>
                <p>
                    The platform must not be used to coordinate illicit activities. Any breach of terms will result in immediate termination of your access keys without appeal.
                </p>
                <h2 className="text-2xl font-bold text-obsidian-text mt-8">Service Availability</h2>
                <p>
                    We guarantee a 99.99% uptime for our secure routing infrastructure, backed by redundant global relays.
                </p>
            </div>
        </div>
    );
};

export default Terms;
