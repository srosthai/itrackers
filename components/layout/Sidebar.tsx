'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Icons } from '../ui/Icons';

// =====================================================
// SIDEBAR COMPONENT
// 
// Main navigation sidebar for the dashboard
// Features: Collapsible on mobile, active state, logout
// =====================================================

interface NavItem {
    label: string;
    href: string;
    icon: keyof typeof Icons;
}

const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: 'Home' },
    { label: 'Transactions', href: '/transactions', icon: 'ArrowsRightLeft' },
    { label: 'Accounts', href: '/accounts', icon: 'Wallet' },
    { label: 'Categories', href: '/categories', icon: 'Tag' },
    { label: 'Budgets', href: '/budgets', icon: 'ChartBar' },
];

const bottomNavItems: NavItem[] = [
    { label: 'Settings', href: '/settings', icon: 'Cog' },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { data: session } = useSession();

    // Get user initials for avatar
    const getInitials = (name?: string | null) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full z-50
          w-[280px] bg-background-secondary border-r border-border
          transform transition-transform duration-300 ease-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
                aria-label="Main navigation"
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-6 h-16 border-b border-border">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
                            <Icons.BankNotes className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-foreground">Budget</h1>
                            <p className="text-xs text-foreground-muted -mt-0.5">Tracker</p>
                        </div>
                        {/* Mobile Close Button */}
                        <button
                            onClick={onClose}
                            className="ml-auto lg:hidden p-2 rounded-lg hover:bg-background-tertiary transition-colors"
                            aria-label="Close sidebar"
                        >
                            <Icons.X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Main Navigation */}
                    <nav className="flex-1 px-3 py-4 overflow-y-auto">
                        <ul className="space-y-1">
                            {navItems.map((item) => {
                                const Icon = Icons[item.icon];
                                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={() => onClose()}
                                            className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl
                        font-medium text-sm
                        transition-all duration-200
                        ${isActive
                                                    ? 'bg-primary-500/10 text-primary-500'
                                                    : 'text-foreground-muted hover:bg-background-tertiary hover:text-foreground'
                                                }
                      `}
                                            aria-current={isActive ? 'page' : undefined}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {item.label}
                                            {isActive && (
                                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Divider */}
                        <div className="my-4 mx-4 border-t border-border" />

                        {/* Quick Stats */}
                        <div className="px-4 py-3">
                            <p className="text-xs font-medium text-foreground-subtle uppercase tracking-wide mb-3">
                                This Month
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-income" />
                                        <span className="text-sm text-foreground-muted">Income</span>
                                    </div>
                                    <span className="text-sm font-medium text-income">$4,250</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-expense" />
                                        <span className="text-sm text-foreground-muted">Expense</span>
                                    </div>
                                    <span className="text-sm font-medium text-expense">$2,180</span>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Bottom Navigation */}
                    <div className="px-3 py-4 border-t border-border">
                        <ul className="space-y-1">
                            {bottomNavItems.map((item) => {
                                const Icon = Icons[item.icon];
                                const isActive = pathname === item.href;

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={() => onClose()}
                                            className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl
                        font-medium text-sm
                        transition-all duration-200
                        ${isActive
                                                    ? 'bg-primary-500/10 text-primary-500'
                                                    : 'text-foreground-muted hover:bg-background-tertiary hover:text-foreground'
                                                }
                      `}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* User Profile */}
                        <div className="mt-4 px-4 py-3 rounded-xl bg-background-tertiary">
                            <div className="flex items-center gap-3">
                                {session?.user?.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || 'User'}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium">
                                        {getInitials(session?.user?.name)}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {session?.user?.name || 'User'}
                                    </p>
                                    <p className="text-xs text-foreground-muted truncate">
                                        {session?.user?.email || ''}
                                    </p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-foreground-muted hover:text-red-500"
                                    aria-label="Logout"
                                    title="Sign out"
                                >
                                    <Icons.Logout className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
