// =====================================================
// RECENT TRANSACTIONS COMPONENT
//
// Shows list of recent transactions
// Features: Category icons, colored amounts, timestamps
// =====================================================

'use client';

import Link from 'next/link';
import { Icons } from '@/components/ui';
import { useLanguage } from '@/components/providers';

interface Transaction {
    transactionId: string;
    type: 'income' | 'expense';
    date: string;
    amount: number;
    categoryId: string;
    categoryName?: string;
    note: string;
}

interface RecentTransactionsProps {
    transactions: Transaction[];
    limit?: number;
    t?: (key: string) => string;
}

// Category icon mapping (simplified)
const categoryIcons: Record<string, { icon: string; bg: string }> = {
    shopping: { icon: '🛍️', bg: 'bg-yellow-500/20' },
    food: { icon: '🍽️', bg: 'bg-orange-500/20' },
    salary: { icon: '💼', bg: 'bg-blue-500/20' },
    electronics: { icon: '📱', bg: 'bg-purple-500/20' },
    transport: { icon: '🚗', bg: 'bg-cyan-500/20' },
    entertainment: { icon: '🎬', bg: 'bg-pink-500/20' },
    utilities: { icon: '💡', bg: 'bg-amber-500/20' },
    default: { icon: '📁', bg: 'bg-gray-500/20' },
};

function getCategoryIcon(categoryId: string, type: string) {
    const key = categoryId?.toLowerCase() || 'default';
    if (categoryIcons[key]) return categoryIcons[key];

    // Default based on type
    if (type === 'income') return { icon: '💰', bg: 'bg-green-500/20' };
    return categoryIcons.default;
}

function formatTimeAgo(dateStr: string, t: (key: string) => string, language: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return t('time.justNow');
    if (diffHours < 24) return `${diffHours}${t('time.hoursAgo')}`;
    if (diffDays === 1) return t('time.yesterday');
    if (diffDays < 7) return `${diffDays} ${t('time.daysAgo')}`;
    return date.toLocaleDateString(language === 'km' ? 'km-KH' : 'en-US', { month: 'short', day: 'numeric' });
}

export function RecentTransactions({ transactions, limit = 5, t: externalT }: RecentTransactionsProps) {
    const { t: internalT, language } = useLanguage();
    const t = externalT || internalT;
    const displayedTransactions = transactions.slice(0, limit);

    if (displayedTransactions.length === 0) {
        return (
            <div className="rounded-2xl bg-[#0f1610] p-5 border border-[#1a2f1a]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-white">{t('dashboard.recentTransactions')}</h3>
                </div>
                <div className="py-8 text-center">
                    <Icons.Receipt className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                    <p className="text-gray-500 text-sm">{t('dashboard.noTransactions')}</p>
                    <p className="text-gray-600 text-xs mt-1">{t('dashboard.addFirst')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl bg-[#0f1610] p-5 border border-[#1a2f1a]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-white">{t('dashboard.recentTransactions')}</h3>
                <Link
                    href="/transactions"
                    className="text-sm font-medium text-[#22c55e] hover:text-[#16a34a] transition-colors"
                >
                    {t('dashboard.seeAll')}
                </Link>
            </div>

            {/* Transaction List */}
            <div className="space-y-3">
                {displayedTransactions.map((tx) => {
                    const { icon, bg } = getCategoryIcon(tx.categoryId, tx.type);
                    const isIncome = tx.type === 'income';
                    const formattedAmount = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                    }).format(tx.amount);

                    return (
                        <div
                            key={tx.transactionId}
                            className="flex items-center gap-3 p-3 rounded-xl bg-[#0a1209] hover:bg-[#0d1610] transition-colors cursor-pointer"
                        >
                            {/* Icon */}
                            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center text-lg shrink-0`}>
                                {icon}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {tx.note || tx.categoryName || tx.categoryId || 'Transaction'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {tx.categoryName || tx.categoryId} • {formatTimeAgo(tx.date, t, language)}
                                </p>
                            </div>

                            {/* Amount */}
                            <div className="text-right shrink-0">
                                <p className={`text-sm font-semibold ${isIncome ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                                    {isIncome ? '+' : '-'}{formattedAmount}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
