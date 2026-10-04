import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUpload, FaSpinner, FaCheckCircle } from 'react-icons/fa';

const Settings = () => {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setProfilePicture(user.profilePicture || '');
            setPreviewImage(user.profilePicture || '');
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 8 * 1024 * 1024) {
                setMessage({ text: 'Image cannot exceed 8MB.', type: 'error' });
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxSize = 256;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxSize) {
                            height = Math.round((height * maxSize) / width);
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width = Math.round((width * maxSize) / height);
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
                    setProfilePicture(compressedBase64);
                    setPreviewImage(compressedBase64);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ text: '', type: '' });

        const result = await updateProfile(name, profilePicture);

        if (result.success) {
            setMessage({ text: 'Profile updated successfully.', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } else {
            setMessage({ text: result.error || 'Failed to update profile.', type: 'error' });
        }
        setIsSaving(false);
    };

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 text-obsidian-text">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-obsidian-gold to-obsidian-goldHover bg-clip-text text-transparent mb-8">
                Settings
            </h1>

            {message.text && (
                <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${message.type === 'success' ? 'bg-green-900/20 text-green-400 border border-green-800' : 'bg-red-900/20 text-red-400 border border-red-800'}`}>
                    {message.type === 'success' && <FaCheckCircle />}
                    <span>{message.text}</span>
                </div>
            )}

            <div className="space-y-8">
                {/* Account Section */}
                <section className="bg-obsidian-card p-8 rounded-xl border border-obsidian-border shadow-lg">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-obsidian-gold to-obsidian-text bg-clip-text text-transparent mb-6">Account</h2>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-black flex items-center justify-center border-2 border-obsidian-border relative shadow-inner">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-bold text-obsidian-gold">{getInitials(name)}</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <label htmlFor="profile-upload" className="cursor-pointer flex flex-col items-center">
                                            <FaUpload className="text-obsidian-gold mb-1" />
                                            <span className="text-xs text-obsidian-gold font-medium">Upload</span>
                                        </label>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    id="profile-upload"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </div>

                            <div className="flex-1 w-full">
                                <label className="block text-sm font-semibold text-obsidian-muted mb-2">Display Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-obsidian-bg border border-obsidian-border rounded-lg px-4 py-3 text-obsidian-text focus:outline-none focus:ring-2 focus:ring-obsidian-gold focus:border-transparent transition-all"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-6 py-2 bg-obsidian-gold text-obsidian-bg font-bold rounded-lg hover:bg-obsidian-goldHover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {isSaving ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <span>Save Changes</span>
                                )}
                            </button>
                        </div>
                    </form>
                </section>

                {/* Billing Section */}
                <section className="bg-obsidian-card p-8 rounded-xl border border-obsidian-border shadow-lg overflow-hidden relative">
                    {/* Decorative Background Accent */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-obsidian-gold/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                    <h2 className="text-2xl font-bold bg-gradient-to-r from-obsidian-gold to-obsidian-text bg-clip-text text-transparent mb-6">Billing</h2>

                    <div className="bg-obsidian-bg border border-obsidian-border rounded-xl p-0 flex flex-col md:flex-row shadow-inner relative overflow-hidden">

                        {/* Left Side Content */}
                        <div className="p-8 flex-1">
                            <h3 className="text-xl font-bold text-obsidian-text mb-2">Current Subscription</h3>
                            <p className="text-obsidian-muted text-sm leading-relaxed max-w-sm mb-6">
                                You are currently utilizing our entry-level tier. This provides access to standard encrypted enclaves and fundamental conferencing capabilities.
                            </p>
                            <button
                                disabled
                                className="px-5 py-2 border border-obsidian-gold/30 text-obsidian-gold rounded-lg font-medium text-sm disabled:opacity-50 hover:bg-obsidian-gold/10 transition-colors cursor-not-allowed"
                            >
                                Upgrade Plan (Coming Soon)
                            </button>
                        </div>

                        {/* Gold Partition */}
                        <div className="hidden md:block w-px h-32 bg-gradient-to-b from-transparent via-obsidian-gold/60 to-transparent self-center"></div>
                        <div className="md:hidden w-48 h-px bg-gradient-to-r from-transparent via-obsidian-gold/60 to-transparent self-center my-6"></div>

                        {/* Right Side Tier Output */}
                        <div className="p-8 md:w-64 flex flex-col items-center justify-center bg-obsidian-bg/50">
                            <span className="text-3xl font-bold text-obsidian-text tracking-wide mb-1">Free</span>
                            <span className="text-xs font-semibold uppercase tracking-widest text-obsidian-gold bg-obsidian-gold/10 px-3 py-1 rounded-full border border-obsidian-gold/20">
                                Complimentary Plan
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
