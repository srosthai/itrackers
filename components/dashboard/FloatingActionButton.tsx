// =====================================================
// FLOATING ACTION BUTTON (FAB)
//
// Quick add transaction button
// Fixed position, always visible
// =====================================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icons } from '@/components/ui';
import { useLanguage } from '@/components/providers';

interface FABProps {
    onClick?: () => void;
}

export function FloatingActionButton({ onClick }: FABProps) {
    const { t } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <div className="fixed right-4 bottom-20 lg:bottom-6 z-40">
            {/* Quick action menu */}
            {isExpanded && (
                <div className="absolute bottom-16 right-0 flex flex-col gap-3 animate-fade-in">
                    <Link
                        href="/transactions?action=add&type=expense"
                        className="flex items-center gap-3 px-4 py-3 bg-[#1a2a1a] rounded-xl border border-[#2a3f2a] hover:bg-[#243324] transition-colors shadow-lg"
                        onClick={() => setIsExpanded(false)}
                    >
                        <div className="w-8 h-8 rounded-lg bg-[#ef4444]/20 flex items-center justify-center">
                            <Icons.ArrowUp className="w-4 h-4 text-[#ef4444]" />
                        </div>
                        <span className="text-sm font-medium text-white whitespace-nowrap">{t('fab.addExpense')}</span>
                    </Link>
                    <Link
                        href="/transactions?action=add&type=income"
                        className="flex items-center gap-3 px-4 py-3 bg-[#1a2a1a] rounded-xl border border-[#2a3f2a] hover:bg-[#243324] transition-colors shadow-lg"
                        onClick={() => setIsExpanded(false)}
                    >
                        <div className="w-8 h-8 rounded-lg bg-[#22c55e]/20 flex items-center justify-center">
                            <Icons.ArrowDown className="w-4 h-4 text-[#22c55e]" />
                        </div>
                        <span className="text-sm font-medium text-white whitespace-nowrap">{t('fab.addIncome')}</span>
                    </Link>
                </div>
            )}

            {/* Main FAB button */}
            <button
                onClick={handleClick}
                className={`w-14 h-14 rounded-full bg-[#22c55e] hover:bg-[#16a34a] shadow-lg shadow-[#22c55e]/30 flex items-center justify-center transition-all duration-200 active:scale-95 ${isExpanded ? 'rotate-45' : ''
                    }`}
                aria-label="Add transaction"
            >
                <Icons.Plus className="w-7 h-7 text-white" />
            </button>

            {/* Backdrop */}
            {isExpanded && (
                <div
                    className="fixed inset-0 -z-10"
                    onClick={() => setIsExpanded(false)}
                />
            )}
        </div>
    );
}
