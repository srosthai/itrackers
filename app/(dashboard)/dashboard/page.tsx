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

    return (
        <div className="min-h-[100dvh] bg-[#0a0f0a]">
            {/* Mobile Layout */}
            <div className="lg:hidden">
                {/* Mobile Header - Sticky with its own padding */}
                <MobileHeader />

                <div className="px-3 sm:px-4 pb-28">
                    {/* Balance Card */}
                    <div className="mb-3 sm:mb-4">
                        {isLoading ? (
                            <BalanceCardSkeleton />
                        ) : (
                            <BalanceCard
                                balance={totalBalance}
                                showBalance={showBalance}
                                onToggleVisibility={toggleBalanceVisibility}
                                isPremium={false}
                            />
                        )}
                    </div>

                    {/* Stats Row */}
                    <div className="mb-3 sm:mb-4">
                        {isLoading ? (
                            <StatsRowSkeleton />
                        ) : (
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
                        )}
                    </div>

                    {/* Spending Chart */}
                    <div className="mb-3 sm:mb-4">
                        {isLoading ? (
                            <ChartSkeleton />
                        ) : (
                            <SpendingChart
                                amount={stats?.expense.amount || 0}
                                change={stats?.expense.change || 0}
                                weeklyData={weeklySpending}
                                dailyData={dailySpending}
                                monthlyData={monthlySpending}
                            />
                        )}
                    </div>

                    {/* Recent Transactions */}
                    {isLoading ? (
                        <TransactionsSkeleton />
                    ) : (
                        <RecentTransactions transactions={recentTransactions} limit={5} t={t} />
                    )}
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
                    recentTransactions={recentTransactions}
                    weeklySpending={weeklySpending}
                    dailySpending={dailySpending}
                    monthlySpending={monthlySpending}
                    totalBalance={totalBalance}
                    showBalance={showBalance}
                    toggleBalanceVisibility={toggleBalanceVisibility}
                    isLoading={isLoading}
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
    recentTransactions: ReturnType<typeof useDashboard>['recentTransactions'];
    weeklySpending: number[];
    dailySpending: number[];
    monthlySpending: number[];
    totalBalance: number;
    showBalance: boolean;
    toggleBalanceVisibility: () => void;
    isLoading: boolean;
}

function DesktopDashboard({
    stats,
    recentTransactions,
    weeklySpending,
    dailySpending,
    monthlySpending,
    totalBalance,
    showBalance,
    toggleBalanceVisibility,
    isLoading,
}: DesktopDashboardProps) {
    const { t, language } = useLanguage();
    const currentMonth = new Date().toLocaleDateString(language === 'km' ? 'km-KH' : 'en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Page Header - Always visible */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">{t('dashboard.title')}</h1>
                <p className="text-gray-500">{currentMonth}</p>
            </div>

            {/* Top Row: Balance + Stats - 4 equal columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {/* Balance Card */}
                {isLoading ? (
                    <StatCardSkeleton />
                ) : (
                    <StatCard
                        label={t('dashboard.totalBalance')}
                        amount={totalBalance}
                        type="balance"
                        showBalance={showBalance}
                        onToggleVisibility={toggleBalanceVisibility}
                    />
                )}

                {/* Income Card */}
                {isLoading ? (
                    <StatCardSkeleton />
                ) : (
                    <StatCard
                        label={t('dashboard.income')}
                        amount={stats?.income.amount || 0}
                        change={stats?.income.change}
                        type="income"
                    />
                )}

                {/* Expense Card */}
                {isLoading ? (
                    <StatCardSkeleton />
                ) : (
                    <StatCard
                        label={t('dashboard.expense')}
                        amount={stats?.expense.amount || 0}
                        change={stats?.expense.change}
                        type="expense"
                    />
                )}

                {/* Profit Card */}
                {isLoading ? (
                    <StatCardSkeleton />
                ) : (
                    <StatCard
                        label={t('dashboard.profit')}
                        amount={stats?.netProfit.amount || 0}
                        change={stats?.netProfit.change}
                        type="profit"
                    />
                )}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left: Chart + Transactions */}
                <div className="xl:col-span-3 space-y-6">
                    {isLoading ? (
                        <ChartSkeleton />
                    ) : (
                        <SpendingChart
                            amount={stats?.expense.amount || 0}
                            change={stats?.expense.change || 0}
                            weeklyData={weeklySpending}
                            dailyData={dailySpending}
                            monthlyData={monthlySpending}
                        />
                    )}
                    {isLoading ? (
                        <TransactionsSkeleton />
                    ) : (
                        <RecentTransactions transactions={recentTransactions} limit={6} t={t} />
                    )}
                </div>
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
    type: 'income' | 'expense' | 'profit' | 'balance';
    showBalance?: boolean;
    onToggleVisibility?: () => void;
}

function StatCard({ label, amount, change, type, showBalance = true, onToggleVisibility }: StatCardProps) {
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(amount);

    const colors = {
        income: { text: 'text-[#22c55e]', bg: 'bg-[#22c55e]/10', icon: Icons.ArrowDown },
        expense: { text: 'text-[#ef4444]', bg: 'bg-[#ef4444]/10', icon: Icons.ArrowUp },
        profit: { text: 'text-white', bg: 'bg-[#3b82f6]/10', icon: Icons.TrendingUp },
        balance: { text: 'text-white', bg: 'bg-[#22c55e]/10', icon: Icons.Wallet },
    };

    const config = colors[type];
    const Icon = config.icon;

    const isBalance = type === 'balance';
    const displayAmount = isBalance && !showBalance ? '••••••••' : formattedAmount;

    return (
        <div className="rounded-xl bg-[#0f1610] p-5 border border-[#1a2f1a] h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-400">{label}</p>
                <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${config.text}`} />
                </div>
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <p className={`text-2xl font-bold ${config.text}`}>{displayAmount}</p>
                    {isBalance && onToggleVisibility && (
                        <button
                            onClick={onToggleVisibility}
                            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            aria-label={showBalance ? 'Hide balance' : 'Show balance'}
                        >
                            {showBalance ? (
                                <Icons.Eye className="w-4 h-4" />
                            ) : (
                                <Icons.EyeOff className="w-4 h-4" />
                            )}
                        </button>
                    )}
                </div>
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
// INLINE SKELETON COMPONENTS
// =====================================================

function BalanceCardSkeleton() {
    return (
        <div className="h-40 rounded-2xl bg-[#0f1610] border border-[#1a2f1a] p-5 animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="w-24 h-4 rounded bg-[#1a2a1a]" />
                <div className="w-8 h-8 rounded-lg bg-[#1a2a1a]" />
            </div>
            <div className="w-40 h-8 rounded bg-[#1a2a1a] mb-3" />
            <div className="w-28 h-3 rounded bg-[#1a2a1a]" />
        </div>
    );
}

function StatsRowSkeleton() {
    return (
        <div className="space-y-2 sm:space-y-3">
            {/* Top row - 2 columns */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[1, 2].map((i) => (
                    <div
                        key={i}
                        className="h-20 sm:h-24 rounded-xl bg-[#0f1610] border border-[#1a2f1a] p-3 animate-pulse"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3.5 h-3.5 rounded bg-[#1a2a1a]" />
                            <div className="w-12 h-3 rounded bg-[#1a2a1a]" />
                        </div>
                        <div className="w-24 h-5 rounded bg-[#1a2a1a]" />
                    </div>
                ))}
            </div>
            {/* Bottom row - full width */}
            <div
                className="h-20 sm:h-24 rounded-xl bg-[#0f1610] border border-[#1a2f1a] p-3 animate-pulse"
                style={{ animationDelay: '300ms' }}
            >
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-3.5 h-3.5 rounded bg-[#1a2a1a]" />
                    <div className="w-12 h-3 rounded bg-[#1a2a1a]" />
                </div>
                <div className="w-32 h-6 rounded bg-[#1a2a1a]" />
            </div>
        </div>
    );
}

function StatCardSkeleton() {
    return (
        <div className="rounded-xl bg-[#0f1610] p-5 border border-[#1a2f1a] h-full animate-pulse">
            <div className="flex items-center justify-between mb-3">
                <div className="w-16 h-4 rounded bg-[#1a2a1a]" />
                <div className="w-10 h-10 rounded-lg bg-[#1a2a1a]" />
            </div>
            <div className="w-28 h-7 rounded bg-[#1a2a1a] mb-2" />
            <div className="w-20 h-3 rounded bg-[#1a2a1a]" />
        </div>
    );
}

function ChartSkeleton() {
    return (
        <div className="rounded-2xl bg-[#0f1610] border border-[#1a2f1a] p-5 animate-pulse">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="w-24 h-4 rounded bg-[#1a2a1a] mb-2" />
                    <div className="w-32 h-6 rounded bg-[#1a2a1a]" />
                </div>
                <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-12 h-7 rounded-lg bg-[#1a2a1a]" />
                    ))}
                </div>
            </div>
            {/* Chart area */}
            <div className="h-32 flex items-end justify-between gap-2 pt-4">
                {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
                    <div
                        key={i}
                        className="flex-1 rounded-t bg-[#1a2a1a]"
                        style={{ height: `${h}%`, animationDelay: `${i * 50}ms` }}
                    />
                ))}
            </div>
            {/* X-axis labels */}
            <div className="flex justify-between mt-2">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="w-6 h-3 rounded bg-[#1a2a1a]" />
                ))}
            </div>
        </div>
    );
}

function TransactionsSkeleton() {
    return (
        <div className="rounded-2xl bg-[#0f1610] border border-[#1a2f1a] p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="w-32 h-5 rounded bg-[#1a2a1a] animate-pulse" />
                <div className="w-16 h-4 rounded bg-[#1a2a1a] animate-pulse" />
            </div>
            {/* Items */}
            <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 animate-pulse"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
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
    );
}
