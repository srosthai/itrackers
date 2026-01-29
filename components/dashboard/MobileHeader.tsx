// =====================================================
// MOBILE HEADER COMPONENT
//
// Shows user greeting, avatar, notifications, settings
// Mobile-first design
// =====================================================

'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Icons } from '@/components/ui';
import { useLanguage } from '@/components/providers';

export function MobileHeader() {
    const { t } = useLanguage();
    const { data: session } = useSession();

    const userName = session?.user?.name || 'User';
    const userImage = session?.user?.image;
    const initials = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="flex items-center justify-between py-4">
            {/* User Info */}
            <div className="flex items-center gap-3">
                {userImage ? (
                    <img
                        src={userImage}
                        alt={userName}
                        className="w-11 h-11 rounded-full object-cover border-2 border-[#22c55e]/20"
                    />
                ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center text-white font-semibold text-sm">
                        {initials}
                    </div>
                )}
                <div>
                    <p className="text-xs text-gray-500">{t('dashboard.welcome')}</p>
                    <p className="text-sm font-semibold text-white">{userName}</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
                <Link
                    href="/profile"
                    className="w-10 h-10 rounded-full bg-[#1a2a1a] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#243324] transition-colors"
                    aria-label="Profile"
                >
                    <Icons.User className="w-5 h-5" />
                </Link>
            </div>
        </div>
    );
}
