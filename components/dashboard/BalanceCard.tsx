// =====================================================
// BALANCE CARD COMPONENT
//
// Shows total balance with card design
// Features: Hide/show balance, premium badge
// =====================================================

'use client';

import { Icons } from '@/components/ui';
import { useLanguage } from '@/components/providers';

interface BalanceCardProps {
    balance: number;
    showBalance: boolean;
    onToggleVisibility: () => void;
    isPremium?: boolean;
}

export function BalanceCard({
    balance,
    showBalance,
    onToggleVisibility,
    isPremium = false,
}: BalanceCardProps) {
    const { t } = useLanguage();
    const formattedBalance = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(balance);

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1f12] via-[#0a1a0f] to-[#081408] p-5 shadow-xl border border-[#1a2f1a]">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#22c55e]/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#22c55e]/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="relative z-10">
                {/* Header with Premium Badge */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-400/80">{t('dashboard.totalBalance')}</p>
                    {isPremium && (
                        <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30">
                            Premium
                        </span>
                    )}
                </div>

                {/* Balance Amount */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                        {showBalance ? formattedBalance : '••••••••'}
                    </h2>
                    <button
                        onClick={onToggleVisibility}
                        className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors text-gray-400 hover:text-white touch-manipulation"
                        aria-label={showBalance ? 'Hide balance' : 'Show balance'}
                    >
                        {showBalance ? (
                            <Icons.Eye className="w-5 h-5" />
                        ) : (
                            <Icons.EyeOff className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
