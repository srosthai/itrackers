// =====================================================
// BOTTOM NAVIGATION COMPONENT
//
// Mobile bottom tab bar
// Only shows on mobile, hidden on desktop
// =====================================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/ui';
import { useLanguage } from '@/components/providers';

interface NavItem {
    labelKey: string;
    href: string;
    icon: keyof typeof Icons;
}

const navItems: NavItem[] = [
    { labelKey: 'nav.home', href: '/dashboard', icon: 'Home' },
    { labelKey: 'nav.insights', href: '/transactions', icon: 'ChartBar' },
    { labelKey: 'nav.categories', href: '/categories', icon: 'Tag' },
    { labelKey: 'nav.profile', href: '/profile', icon: 'User' },
];

export function BottomNavigation() {
    const pathname = usePathname();
    const { t } = useLanguage();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0a] via-[#0a0f0a]/95 to-transparent -top-6 pointer-events-none" />

            {/* Navigation bar */}
            <div className="relative bg-[#0f1610] border-t border-[#1a2f1a] px-2 sm:px-4 safe-area-bottom">
                <div className="flex items-center justify-around py-1.5 sm:py-2">
                    {navItems.map((item) => {
                        const Icon = Icons[item.icon];
                        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center gap-0.5 py-2 px-3 sm:px-4 rounded-xl transition-colors min-w-[56px] sm:min-w-[64px] touch-manipulation ${isActive
                                    ? 'text-[#22c55e]'
                                    : 'text-gray-500 active:text-gray-300'
                                    }`}
                            >
                                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span className="text-[10px] sm:text-[11px] font-medium truncate max-w-[56px] text-center">{t(item.labelKey)}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
