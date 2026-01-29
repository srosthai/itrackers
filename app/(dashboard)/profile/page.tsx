'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Icons } from '@/components/ui';
import { BottomNavigation } from '@/components/dashboard';
import { useTheme, useLanguage } from '@/components/providers';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    const userName = session?.user?.name || 'User';
    const userEmail = session?.user?.email || '';
    const userImage = session?.user?.image;
    const initials = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    if (status === 'loading') {
        return <ProfileSkeleton />;
    }

    return (
        <div className="min-h-screen bg-[#0a0f0a] dark:bg-[#0a0f0a] light:bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sticky top-0 bg-[#0a0f0a]/95 dark:bg-[#0a0f0a]/95 backdrop-blur z-10">
                <h1 className="text-xl font-bold text-white dark:text-white">{t('profile.title')}</h1>
            </div>

            <div className="flex-1 px-4 py-2 overflow-y-auto pb-24">
                {/* Profile Card */}
                <div className="flex items-center gap-4 p-4 bg-[#1a2a1a] dark:bg-[#1a2a1a] rounded-2xl mb-6 border border-[#2a3f2a] dark:border-[#2a3f2a]">
                    {userImage ? (
                        <img src={userImage} alt={userName} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center text-white text-xl font-bold">
                            {initials}
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-white dark:text-white truncate">{userName}</h2>
                        <p className="text-sm text-gray-400 dark:text-gray-400 truncate">{userEmail}</p>
                    </div>
                </div>

                {/* Appearance Section */}
                <div className="mb-6">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 mb-3">
                        {t('profile.appearance')}
                    </p>

                    <div className="bg-[#1a2a1a] dark:bg-[#1a2a1a] rounded-2xl border border-[#2a3f2a] dark:border-[#2a3f2a] overflow-hidden">
                        {/* Theme Toggle */}
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                        {theme === 'dark' ? (
                                            <MoonIcon className="w-5 h-5 text-purple-400" />
                                        ) : (
                                            <SunIcon className="w-5 h-5 text-yellow-400" />
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-white dark:text-white">
                                        {theme === 'dark' ? t('profile.darkMode') : t('profile.lightMode')}
                                    </span>
                                </div>
                            </div>

                            {/* Theme Selector */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${theme === 'light'
                                        ? 'bg-[#22c55e]/20 border-[#22c55e] text-[#22c55e]'
                                        : 'bg-[#0f1610] border-[#2a3f2a] text-gray-400 hover:border-gray-500'
                                        }`}
                                >
                                    <SunIcon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{t('profile.lightMode')}</span>
                                </button>
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${theme === 'dark'
                                        ? 'bg-[#22c55e]/20 border-[#22c55e] text-[#22c55e]'
                                        : 'bg-[#0f1610] border-[#2a3f2a] text-gray-400 hover:border-gray-500'
                                        }`}
                                >
                                    <MoonIcon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{t('profile.darkMode')}</span>
                                </button>
                            </div>
                        </div>

                        <div className="h-px bg-[#2a3f2a]" />

                        {/* Language Toggle */}
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                        <GlobeIcon className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <span className="text-sm font-medium text-white dark:text-white">
                                        {t('profile.language')}
                                    </span>
                                </div>
                            </div>

                            {/* Language Selector */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setLanguage('en')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${language === 'en'
                                        ? 'bg-[#22c55e]/20 border-[#22c55e] text-[#22c55e]'
                                        : 'bg-[#0f1610] border-[#2a3f2a] text-gray-400 hover:border-gray-500'
                                        }`}
                                >
                                    <span className="text-base">🇺🇸</span>
                                    <span className="text-sm font-medium">English</span>
                                </button>
                                <button
                                    onClick={() => setLanguage('km')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${language === 'km'
                                        ? 'bg-[#22c55e]/20 border-[#22c55e] text-[#22c55e]'
                                        : 'bg-[#0f1610] border-[#2a3f2a] text-gray-400 hover:border-gray-500'
                                        }`}
                                >
                                    <span className="text-base">🇰🇭</span>
                                    <span className="text-sm font-medium">ខ្មែរ</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* General Section */}
                <div className="mb-6">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 mb-3">
                        {t('profile.general')}
                    </p>

                    <div className="bg-[#1a2a1a] dark:bg-[#1a2a1a] rounded-2xl border border-[#2a3f2a] dark:border-[#2a3f2a] overflow-hidden">
                        <Link
                            href="/categories"
                            className="flex items-center gap-4 p-4 hover:bg-[#243324] transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-[#22c55e]/20 flex items-center justify-center">
                                <Icons.Tag className="w-5 h-5 text-[#22c55e]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-white dark:text-white">{t('profile.categories')}</p>
                                <p className="text-xs text-gray-500">{t('profile.categoriesDesc')}</p>
                            </div>
                            <Icons.ChevronRight className="w-5 h-5 text-gray-600" />
                        </Link>
                    </div>
                </div>

                {/* Account Section */}
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 mb-3">
                        {t('profile.account')}
                    </p>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 p-4 bg-red-500/10 rounded-2xl hover:bg-red-500/20 transition-colors border border-red-500/20 hover:border-red-500/40"
                    >
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <Icons.Logout className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-semibold text-red-500">{t('profile.logout')}</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <div className="lg:hidden">
                <BottomNavigation />
            </div>
        </div>
    );
}

// =====================================================
// ICONS
// =====================================================

function SunIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
    );
}

function MoonIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
    );
}

function GlobeIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
    );
}

// =====================================================
// SKELETON LOADER
// =====================================================

function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-[#0a0f0a] flex flex-col p-4">
            <div className="animate-pulse">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="w-20 h-7 rounded bg-[#1a2a1a]" />
                </div>

                {/* Profile Card */}
                <div className="flex items-center gap-4 p-4 bg-[#1a2a1a] rounded-2xl mb-6 border border-[#2a3f2a]">
                    <div className="w-16 h-16 rounded-full bg-[#2a3f2a]" />
                    <div className="flex-1">
                        <div className="w-32 h-5 rounded bg-[#2a3f2a] mb-2" />
                        <div className="w-48 h-4 rounded bg-[#2a3f2a]" />
                    </div>
                </div>

                {/* Appearance Section */}
                <div className="mb-6">
                    <div className="w-24 h-3 rounded bg-[#1a2a1a] mb-3" />
                    <div className="bg-[#1a2a1a] rounded-2xl border border-[#2a3f2a] p-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#2a3f2a]" />
                            <div className="w-24 h-4 rounded bg-[#2a3f2a]" />
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1 h-12 rounded-xl bg-[#2a3f2a]" />
                            <div className="flex-1 h-12 rounded-xl bg-[#2a3f2a]" />
                        </div>
                    </div>
                </div>

                {/* General Section */}
                <div className="mb-6">
                    <div className="w-20 h-3 rounded bg-[#1a2a1a] mb-3" />
                    <div className="bg-[#1a2a1a] rounded-2xl border border-[#2a3f2a] p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#2a3f2a]" />
                            <div className="flex-1">
                                <div className="w-24 h-4 rounded bg-[#2a3f2a] mb-1" />
                                <div className="w-40 h-3 rounded bg-[#2a3f2a]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logout */}
                <div className="w-20 h-3 rounded bg-[#1a2a1a] mb-3" />
                <div className="h-16 rounded-2xl bg-red-500/10 border border-red-500/20" />
            </div>
        </div>
    );
}
