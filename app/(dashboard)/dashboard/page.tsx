'use client';

import { useDashboard } from '@/hooks';
import {
    BalanceCard,
    StatsRow,
    SpendingChart,
    RecentTransactions,
    MobileHeader,
    BottomNavigation,
    FloatingActionButton,
} from '@/components/dashboard';
import { Icons } from '@/components/ui';
import { useLanguage } from '@/components/providers';

// =====================================================
// DASHBOARD PAGE
// 
// Mobile-first design following reference image
// Desktop: Shows with sidebar layout
// Mobile: Full-width with bottom navigation
// 
// Architecture:
// - useDashboard hook: Data fetching & state
// - Components: Presentational only
// - Page: Composition layer
// =====================================================

export default function DashboardPage() {
    const { t } = useLanguage();
    const {
        stats,
        accounts,
        recentTransactions,
        weeklySpending,
        dailySpending,
        monthlySpending,
        isLoading,
        showBalance,
        toggleBalanceVisibility,
    } = useDashboard();

    // Use total balance from stats
    const totalBalance = stats?.totalBalance.amount || 0;

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="min-h-screen bg-[#0a0f0a]">
            {/* Mobile Layout */}
            <div className="lg:hidden">
                <div className="px-4 pb-24">
                    {/* Mobile Header */}
                    <MobileHeader />

                    {/* Balance Card */}
                    <div className="mb-4">
                        <BalanceCard
                            balance={totalBalance}
                            showBalance={showBalance}
                            onToggleVisibility={toggleBalanceVisibility}
                            isPremium={false}
                        />
                    </div>

                    {/* Stats Row */}
                    <div className="mb-4">
                        <StatsRow
                            income={{
                                amount: stats?.income.amount || 0,
                                change: stats?.income.change,
                            }}
                            expense={{
                                amount: stats?.expense.amount || 0,
                                change: stats?.expense.change,
                            }}
                            profit={{
                                amount: stats?.netProfit.amount || 0,
                                change: stats?.netProfit.change,
                            }}
                        />
                    </div>

                    {/* Spending Chart */}
                    <div className="mb-4">
                        <SpendingChart
                            amount={stats?.expense.amount || 0}
                            change={stats?.expense.change || 0}
                            weeklyData={weeklySpending}
                            dailyData={dailySpending}
                            monthlyData={monthlySpending}
                        />
                    </div>

                    {/* Recent Transactions */}
                    <RecentTransactions transactions={recentTransactions} limit={5} t={t} />
                </div>

                {/* Bottom Navigation */}
                <BottomNavigation />

                {/* Floating Action Button */}
                <FloatingActionButton />
            </div>

            {/* Desktop Layout - Uses DashboardLayout from parent */}
            <div className="hidden lg:block">
                <DesktopDashboard
                    stats={stats}
                    accounts={[]}
                    recentTransactions={recentTransactions}
                    weeklySpending={weeklySpending}
                    dailySpending={dailySpending}
                    monthlySpending={monthlySpending}
                    totalBalance={totalBalance}
                    showBalance={showBalance}
                    toggleBalanceVisibility={toggleBalanceVisibility}
                />
            </div>
        </div>
    );
}

// =====================================================
// DESKTOP LAYOUT COMPONENT
// =====================================================

interface DesktopDashboardProps {
    stats: ReturnType<typeof useDashboard>['stats'];
    accounts: ReturnType<typeof useDashboard>['accounts'];
    recentTransactions: ReturnType<typeof useDashboard>['recentTransactions'];
    weeklySpending: number[];
    dailySpending: number[];
    monthlySpending: number[];
    totalBalance: number;
    showBalance: boolean;
    toggleBalanceVisibility: () => void;
}

function DesktopDashboard({
    stats,
    accounts,
    recentTransactions,
    weeklySpending,
    dailySpending,
    monthlySpending,
    totalBalance,
    showBalance,
    toggleBalanceVisibility,
}: DesktopDashboardProps) {
    const { t, language } = useLanguage();
    const currentMonth = new Date().toLocaleDateString(language === 'km' ? 'km-KH' : 'en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">{t('dashboard.title')}</h1>
                <p className="text-gray-500">{currentMonth}</p>
            </div>

            {/* Top Row: Balance + Stats */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                {/* Balance Card - Takes 1 column */}
                <div className="xl:col-span-1">
                    <BalanceCard
                        balance={totalBalance}
                        showBalance={showBalance}
                        onToggleVisibility={toggleBalanceVisibility}
                        isPremium={false}
                    />
                </div>

                {/* Stats - Takes 2 columns */}
                <div className="xl:col-span-2">
                    <div className="grid grid-cols-3 gap-4 h-full">
                        <StatCard
                            label={t('dashboard.income')}
                            amount={stats?.income.amount || 0}
                            change={stats?.income.change}
                            type="income"
                        />
                        <StatCard
                            label={t('dashboard.expense')}
                            amount={stats?.expense.amount || 0}
                            change={stats?.expense.change}
                            type="expense"
                        />
                        <StatCard
                            label={t('dashboard.profit')}
                            amount={stats?.netProfit.amount || 0}
                            change={stats?.netProfit.change}
                            type="profit"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left: Chart + Transactions */}
                <div className="xl:col-span-3 space-y-6">
                    <SpendingChart
                        amount={stats?.expense.amount || 0}
                        change={stats?.expense.change || 0}
                        weeklyData={weeklySpending}
                        dailyData={dailySpending}
                        monthlyData={monthlySpending}
                    />
                    <RecentTransactions transactions={recentTransactions} limit={6} t={t} />
                </div>

                {/* Removed Accounts Card Column */}
            </div>


            {/* Floating Action Button */}
            <FloatingActionButton />
        </div>
    );
}

// =====================================================
// DESKTOP STAT CARD
// =====================================================

interface StatCardProps {
    label: string;
    amount: number;
    change?: number | null;
    type: 'income' | 'expense' | 'profit';
}

function StatCard({ label, amount, change, type }: StatCardProps) {
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(amount);

    const colors = {
        income: { text: 'text-[#22c55e]', bg: 'bg-[#22c55e]/10', icon: Icons.ArrowDown },
        expense: { text: 'text-[#ef4444]', bg: 'bg-[#ef4444]/10', icon: Icons.ArrowUp },
        profit: { text: 'text-white', bg: 'bg-[#3b82f6]/10', icon: Icons.TrendingUp },
    };

    const config = colors[type];
    const Icon = config.icon;

    return (
        <div className="rounded-xl bg-[#0f1610] p-5 border border-[#1a2f1a] h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-400">{label}</p>
                <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${config.text}`} />
                </div>
            </div>
            <div>
                <p className={`text-2xl font-bold ${config.text}`}>{formattedAmount}</p>
                {change !== undefined && change !== null && (
                    <p className={`text-sm mt-1 ${change >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                        {change >= 0 ? '+' : ''}{change.toFixed(1)}% vs last month
                    </p>
                )}
            </div>
        </div>
    );
}

// =====================================================
// ACCOUNTS CARD
// =====================================================

interface AccountsCardProps {
    accounts: Array<{
        accountId: string;
        name: string;
        type: string;
        currency: string;
        currentBalance: number;
        color: string;
    }>;
}

function AccountsCard({ accounts }: AccountsCardProps) {
    return (
        <div className="rounded-xl bg-[#0f1610] p-5 border border-[#1a2f1a]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-white">Accounts</h3>
                <button className="text-sm font-medium text-[#22c55e] hover:text-[#16a34a] transition-colors flex items-center gap-1">
                    <Icons.Plus className="w-4 h-4" />
                    Add
                </button>
            </div>

            {accounts.length === 0 ? (
                <div className="py-6 text-center">
                    <Icons.Wallet className="w-10 h-10 mx-auto text-gray-600 mb-2" />
                    <p className="text-gray-500 text-sm">No accounts yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {accounts.map((account) => {
                        const formattedBalance = new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: account.currency || 'USD',
                            minimumFractionDigits: 2,
                        }).format(account.currentBalance);

                        return (
                            <div
                                key={account.accountId}
                                className="flex items-center gap-3 p-3 rounded-xl bg-[#0a1209] hover:bg-[#0d1610] transition-colors cursor-pointer"
                            >
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                    style={{ backgroundColor: account.color || '#22c55e' }}
                                >
                                    {account.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{account.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{account.type}</p>
                                </div>
                                <p className="text-sm font-semibold text-white">{formattedBalance}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// =====================================================
// LOADING SKELETON
// =====================================================

function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-[#0a0f0a] p-4 lg:p-6">
            <div className="animate-pulse space-y-4">
                {/* Header skeleton */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-full bg-[#1a2a1a]" />
                    <div className="space-y-2">
                        <div className="w-20 h-3 rounded bg-[#1a2a1a]" />
                        <div className="w-28 h-4 rounded bg-[#1a2a1a]" />
                    </div>
                </div>

                {/* Balance card skeleton */}
                <div className="h-40 rounded-2xl bg-[#0f1610] border border-[#1a2f1a]" />

                {/* Stats skeleton */}
                <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 rounded-xl bg-[#0f1610] border border-[#1a2f1a]" />
                    ))}
                </div>

                {/* Chart skeleton */}
                <div className="h-48 rounded-2xl bg-[#0f1610] border border-[#1a2f1a]" />

                {/* Transactions skeleton */}
                <div className="rounded-2xl bg-[#0f1610] border border-[#1a2f1a] p-5">
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-[#1a2a1a]" />
                                <div className="flex-1 space-y-2">
                                    <div className="w-32 h-4 rounded bg-[#1a2a1a]" />
                                    <div className="w-20 h-3 rounded bg-[#1a2a1a]" />
                                </div>
                                <div className="w-20 h-4 rounded bg-[#1a2a1a]" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
