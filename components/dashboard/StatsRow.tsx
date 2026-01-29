// =====================================================
// STATS ROW COMPONENT
//
// Shows Income, Expenses, Profit in a row
// Responsive: 3 columns on all sizes
// =====================================================

'use client';

import { Icons } from '@/components/ui';
import { useLanguage } from '@/components/providers';

interface StatItemProps {
    label: string;
    amount: number;
    change?: number | null;
    type: 'income' | 'expense' | 'profit';
}

function StatItem({ label, amount, change, type }: StatItemProps) {
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Math.abs(amount));

    const colors = {
        income: {
            bg: 'bg-[#0d1f12]',
            text: 'text-[#22c55e]',
            label: 'text-[#22c55e]',
            icon: Icons.ArrowDown,
        },
        expense: {
            bg: 'bg-[#1f120d]',
            text: 'text-[#ef4444]',
            label: 'text-[#ef4444]',
            icon: Icons.ArrowUp,
        },
        profit: {
            bg: 'bg-[#12171f]',
            text: 'text-white',
            label: 'text-gray-400',
            icon: Icons.TrendingUp,
        },
    };

    const config = colors[type];
    const Icon = config.icon;

    return (
        <div className={`${config.bg} rounded-xl p-4 border border-white/5`}>
            <div className="flex items-center gap-1.5 mb-2">
                <Icon className={`w-3.5 h-3.5 ${config.label}`} />
                <span className={`text-xs font-medium uppercase tracking-wide ${config.label}`}>
                    {label}
                </span>
            </div>
            <p className={`text-lg sm:text-xl font-bold ${config.text}`}>
                {formattedAmount}
            </p>
            {change !== undefined && change !== null && (
                <p className={`text-xs mt-1 ${change >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                    {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                </p>
            )}
        </div>
    );
}

interface StatsRowProps {
    income: { amount: number; change?: number | null };
    expense: { amount: number; change?: number | null };
    profit: { amount: number; change?: number | null };
}

export function StatsRow({ income, expense, profit }: StatsRowProps) {
    const { t } = useLanguage();

    return (
        <div className="grid grid-cols-3 gap-3">
            <StatItem
                label={t('dashboard.income')}
                amount={income.amount}
                change={income.change}
                type="income"
            />
            <StatItem
                label={t('dashboard.expense')}
                amount={expense.amount}
                change={expense.change}
                type="expense"
            />
            <StatItem
                label={t('dashboard.profit')}
                amount={profit.amount}
                change={profit.change}
                type="profit"
            />
        </div>
    );
}
