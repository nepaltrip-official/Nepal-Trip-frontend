import React, { useState } from "react";
import {
    Globe,
    User,
    Lock,
    Smartphone,
    Monitor,
    Save,
    Image as ImageIcon,
    LogOut,
    ShieldCheck,
    Briefcase,
    MapPin,
    Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// CUSTOM SVG ICONS (Since Lucide doesn't export brands)
// ==========================================
const YoutubeIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.17 1 12 1 12s0 3.83.54 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.83 23 12 23 12s0-3.83-.54-5.58z"></path>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
    </svg>
);

const InstagramIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const FacebookIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
);

const TwitterIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
    </svg>
);

// ==========================================
// DUMMY DATA
// ==========================================
const mockActiveSessions = [
    { id: 1, device: "MacBook Pro", browser: "Chrome", location: "Sultanpur, India", time: "Active now", isCurrent: true },
    { id: 2, device: "iPhone 13", browser: "Safari", location: "Sultanpur, India", time: "Last active 2 hours ago", isCurrent: false },
    { id: 3, device: "Windows Desktop", browser: "Edge", location: "New Delhi, India", time: "Last active 3 days ago", isCurrent: false },
];

// Framer Motion Variants
const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut", staggerChildren: 0.1 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
};

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState("site");
    const [isSavingSite, setIsSavingSite] = useState(false);
    const [isSavingAccount, setIsSavingAccount] = useState(false);
    const [isSavingSecurity, setIsSavingSecurity] = useState(false);

    // Site Settings State
    const [siteDetails, setSiteDetails] = useState({
        brandName: "Nepal Trip",
        tagline: "CURATED JOURNEYS, UNFORGETTABLE MEMORIES",
        email: "ankitpandey78600@gmail.com",
        phone: "+91 8318538918",
        address: "721/1 Sri Ram Nagar Civil Line 1 Sultanpur",
        youtube: "https://youtube.com/@nepaltrip",
        instagram: "https://instagram.com/nepaltrip",
        facebook: "https://facebook.com/nepaltrip",
        twitter: "https://twitter.com/nepaltrip"
    });

    // Account Settings State
    const [accountDetails, setAccountDetails] = useState({
        name: "Admin User",
        email: "admin@nepaltrip.com",
    });

    const [sessions, setSessions] = useState(mockActiveSessions);

    const handleSiteChange = (e) => setSiteDetails({ ...siteDetails, [e.target.name]: e.target.value });
    const handleAccountChange = (e) => setAccountDetails({ ...accountDetails, [e.target.name]: e.target.value });

    // Handlers for distinct save buttons
    const handleSaveSite = (e) => {
        e.preventDefault();
        setIsSavingSite(true);
        setTimeout(() => setIsSavingSite(false), 1200);
    };

    const handleSaveAccount = (e) => {
        e.preventDefault();
        setIsSavingAccount(true);
        setTimeout(() => setIsSavingAccount(false), 1200);
    };

    const handleSaveSecurity = (e) => {
        e.preventDefault();
        setIsSavingSecurity(true);
        setTimeout(() => setIsSavingSecurity(false), 1200);
    };

    const handleRevokeSession = (id) => {
        setSessions(sessions.filter(session => session.id !== id));
    };

    // Reusable Input Component updated to support Icons
    const FormInput = ({ label, type = "text", icon: Icon, ...props }) => (
        <div className="space-y-1.5 w-full">
            <label className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2A5244]/60">
                        <Icon className="h-4 w-4" />
                    </div>
                )}
                <input
                    type={type}
                    className={`w-full py-3 bg-[#FDFBF7] border border-border/60 rounded-xl text-sm font-medium text-foreground focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2A5244]/30 focus:border-[#2A5244] transition-all placeholder:text-muted-foreground/60 shadow-sm ${Icon ? 'pl-10 pr-4' : 'px-4'}`}
                    {...props}
                />
            </div>
        </div>
    );

    // Reusable Submit Button with pure Shimmer UI (removed traditional text loader)
    const SubmitButton = ({ isSaving, defaultText }) => (
        <button
            type="submit"
            disabled={isSaving}
            className="relative overflow-hidden inline-flex items-center justify-center gap-2 bg-[#2A5244] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-[#214136] transition-all active:scale-95 disabled:opacity-80 disabled:pointer-events-none min-w-35"
        >
            <AnimatePresence>
                {isSaving && (
                    <motion.div
                        className="absolute inset-0 z-0 bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-12"
                        initial={{ x: '-150%' }}
                        animate={{ x: '150%' }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    />
                )}
            </AnimatePresence>
            <span className="relative z-10 flex items-center gap-2">
                {defaultText} <Save className="h-4 w-4" />
            </span>
        </button>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 pb-12 font-sans">

            {/* Header */}
            <div className="px-2 md:px-0">
                <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground tracking-tight">Settings</h1>
                <p className="text-sm md:text-base text-muted-foreground mt-2">Manage your global brand identity, security, and active sessions.</p>
            </div>

            {/* Tabs (Fluid Mobile Layout without Scrollbar) */}
            <div className="flex w-full border-b border-border/40">
                <button
                    onClick={() => setActiveTab("site")}
                    className={`flex-1 md:flex-none pb-3 text-[11px] sm:text-sm font-bold transition-all border-b-2 px-1 sm:px-4 flex items-center justify-center md:justify-start gap-1.5 ${activeTab === "site"
                        ? "border-[#2A5244] text-[#2A5244]"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        }`}
                >
                    <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                    <span className="truncate">Global Site Details</span>
                </button>
                <button
                    onClick={() => setActiveTab("account")}
                    className={`flex-1 md:flex-none pb-3 text-[11px] sm:text-sm font-bold transition-all border-b-2 px-1 sm:px-4 flex items-center justify-center md:justify-start gap-1.5 ${activeTab === "account"
                        ? "border-[#2A5244] text-[#2A5244]"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        }`}
                >
                    <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                    <span className="truncate">Account & Security</span>
                </button>
            </div>

            {/* TAB CONTENT */}
            <div className="relative min-h-125">
                <AnimatePresence mode="wait">
                    {/* ================================================== */}
                    {/* GLOBAL SITE DETAILS TAB */}
                    {/* ================================================== */}
                    {activeTab === "site" && (
                        <motion.div
                            key="tab-site"
                            variants={tabContentVariants}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            className="space-y-6"
                        >
                            <form onSubmit={handleSaveSite} className="bg-white border border-border/40 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden">
                                <div className="p-5 md:p-8 space-y-8 md:space-y-10">

                                    {/* Brand Details */}
                                    <motion.div variants={itemVariants}>
                                        <h3 className="text-lg md:text-xl font-bold font-serif text-foreground mb-5 flex items-center gap-2">
                                            <Briefcase className="h-5 w-5 text-[#2A5244]" /> Brand Identity
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                                            <FormInput label="Brand Name" name="brandName" value={siteDetails.brandName} onChange={handleSiteChange} />
                                            <FormInput label="Tagline" name="tagline" value={siteDetails.tagline} onChange={handleSiteChange} />
                                        </div>
                                    </motion.div>

                                    <hr className="border-border/40" />

                                    {/* Contact Details */}
                                    <motion.div variants={itemVariants}>
                                        <h3 className="text-lg md:text-xl font-bold font-serif text-foreground mb-5 flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-[#2A5244]" /> Contact Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                                            <FormInput label="Official Email" type="email" name="email" value={siteDetails.email} onChange={handleSiteChange} />
                                            <FormInput label="Contact Phone" name="phone" value={siteDetails.phone} onChange={handleSiteChange} />
                                            <div className="md:col-span-2">
                                                <FormInput label="Physical Office Address" name="address" value={siteDetails.address} onChange={handleSiteChange} />
                                            </div>
                                        </div>
                                    </motion.div>

                                    <hr className="border-border/40" />

                                    {/* Social Links (With Custom SVGs) */}
                                    <motion.div variants={itemVariants}>
                                        <h3 className="text-lg md:text-xl font-bold font-serif text-foreground mb-5 flex items-center gap-2">
                                            <Globe className="h-5 w-5 text-[#2A5244]" /> Social Media Presence
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                                            <FormInput label="YouTube Channel" type="url" name="youtube" icon={YoutubeIcon} value={siteDetails.youtube} onChange={handleSiteChange} />
                                            <FormInput label="Instagram Profile" type="url" name="instagram" icon={InstagramIcon} value={siteDetails.instagram} onChange={handleSiteChange} />
                                            <FormInput label="Facebook Page" type="url" name="facebook" icon={FacebookIcon} value={siteDetails.facebook} onChange={handleSiteChange} />
                                            <FormInput label="Twitter / X Profile" type="url" name="twitter" icon={TwitterIcon} value={siteDetails.twitter} onChange={handleSiteChange} />
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="bg-[#FDFBF7] px-5 py-4 md:px-8 md:py-5 border-t border-border/40 flex justify-end">
                                    <SubmitButton isSaving={isSavingSite} defaultText="Save Configuration" />
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* ================================================== */}
                    {/* ACCOUNT & SECURITY TAB */}
                    {/* ================================================== */}
                    {activeTab === "account" && (
                        <motion.div
                            key="tab-account"
                            variants={tabContentVariants}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            className="space-y-6 md:space-y-8"
                        >
                            {/* Profile Management */}
                            <motion.form variants={itemVariants} onSubmit={handleSaveAccount} className="bg-white border border-border/40 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden">
                                <div className="p-5 md:p-8 space-y-6 md:space-y-8">
                                    <h3 className="text-lg md:text-xl font-bold font-serif text-foreground flex items-center gap-2">
                                        <User className="h-5 w-5 text-[#2A5244]" /> Profile Management
                                    </h3>

                                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                                        {/* Avatar UI */}
                                        <div className="flex flex-col items-center gap-4 shrink-0">
                                            <div className="h-28 w-28 rounded-full bg-linear-to-br from-[#2A5244] to-[#1a332a] flex items-center justify-center border-4 border-white shadow-lg text-white font-serif text-4xl font-bold">
                                                {accountDetails.name.charAt(0)}
                                            </div>
                                            <button type="button" className="text-xs font-bold text-[#2A5244] hover:text-[#FA6D16] transition-colors flex items-center gap-1.5 px-3 py-1.5 bg-[#2A5244]/5 rounded-full">
                                                <ImageIcon className="h-3.5 w-3.5" /> Upload Photo
                                            </button>
                                        </div>

                                        {/* Inputs */}
                                        <div className="flex-1 w-full space-y-5 md:pt-2">
                                            <FormInput label="Full Name" name="name" value={accountDetails.name} onChange={handleAccountChange} />
                                            <FormInput label="Login Email Address" type="email" name="email" value={accountDetails.email} onChange={handleAccountChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-[#FDFBF7] px-5 py-4 md:px-8 md:py-5 border-t border-border/40 flex justify-end">
                                    <SubmitButton isSaving={isSavingAccount} defaultText="Update Profile" />
                                </div>
                            </motion.form>

                            {/* Security & Passwords */}
                            <motion.form variants={itemVariants} onSubmit={handleSaveSecurity} className="bg-white border border-border/40 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden">
                                <div className="p-5 md:p-8 space-y-6">
                                    <h3 className="text-lg md:text-xl font-bold font-serif text-foreground flex items-center gap-2">
                                        <Lock className="h-5 w-5 text-[#2A5244]" /> Update Password
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 md:max-w-4xl">
                                        <div className="md:col-span-2">
                                            <FormInput label="Current Password" type="password" placeholder="••••••••" />
                                        </div>
                                        <FormInput label="New Password" type="password" placeholder="••••••••" />
                                        <FormInput label="Confirm New Password" type="password" placeholder="••••••••" />
                                    </div>
                                </div>
                                <div className="bg-[#FDFBF7] px-5 py-4 md:px-8 md:py-5 border-t border-border/40 flex justify-end">
                                    <SubmitButton isSaving={isSavingSecurity} defaultText="Change Password" />
                                </div>
                            </motion.form>

                            {/* Active Sessions */}
                            <motion.div variants={itemVariants} className="bg-white border border-border/40 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden">
                                <div className="p-5 md:p-8 border-b border-border/40 bg-[#FDFBF7]">
                                    <h3 className="text-lg md:text-xl font-bold font-serif text-foreground flex items-center gap-2">
                                        <Monitor className="h-5 w-5 text-[#2A5244]" /> Active Sessions
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-2">Review and revoke devices currently logged into your account.</p>
                                </div>
                                <ul className="divide-y divide-border/20">
                                    <AnimatePresence mode="popLayout">
                                        {sessions.map(session => (
                                            <motion.li
                                                key={session.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                                                className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/10 transition-colors"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-3 rounded-full mt-1 shrink-0 ${session.isCurrent ? 'bg-emerald-100 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                                                        {session.device.includes("iPhone") || session.device.includes("Mobile") ? (
                                                            <Smartphone className="h-5 w-5 md:h-6 md:w-6" />
                                                        ) : (
                                                            <Monitor className="h-5 w-5 md:h-6 md:w-6" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm md:text-base text-foreground flex flex-wrap items-center gap-2">
                                                            {session.device} • {session.browser}
                                                            {session.isCurrent && (
                                                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                                                                    This Device
                                                                </span>
                                                            )}
                                                        </p>
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1.5 text-xs font-medium text-muted-foreground">
                                                            <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {session.location}</span>
                                                            <span className="hidden sm:inline text-border">•</span>
                                                            <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {session.time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {!session.isCurrent && (
                                                    <button
                                                        onClick={() => handleRevokeSession(session.id)}
                                                        className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 px-4 py-2 rounded-lg transition-colors self-start sm:self-center w-full sm:w-auto"
                                                    >
                                                        <LogOut className="h-3.5 w-3.5" /> Revoke Access
                                                    </button>
                                                )}
                                            </motion.li>
                                        ))}
                                    </AnimatePresence>
                                    {sessions.length === 0 && (
                                        <li className="p-8 text-center text-muted-foreground text-sm font-medium">
                                            No active sessions found.
                                        </li>
                                    )}
                                </ul>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}