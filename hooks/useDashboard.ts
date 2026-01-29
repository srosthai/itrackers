// =====================================================
// USE DASHBOARD HOOK
// 
// Fetches and manages dashboard data
// Separates data logic from UI
// =====================================================

'use client';

import { useState, useEffect, useCallback } from 'react';

interface DashboardStats {
    income: { amount: number; change: number | null };
    expense: { amount: number; change: number | null };
    netProfit: { amount: number; change: number | null };
    totalBalance: { amount: number };
}

interface Account {
    accountId: string;
    name: string;
    type: string;
    currency: string;
    currentBalance: number;
    color: string;
}

interface Transaction {
    transactionId: string;
    type: 'income' | 'expense';
    date: string;
    amount: number;
    categoryId: string;
    categoryName?: string;
    note: string;
}

interface UseDashboardReturn {
    // Data
    stats: DashboardStats | null;
    accounts: Account[];
    recentTransactions: Transaction[];
    weeklySpending: number[];
    dailySpending: number[];
    monthlySpending: number[];
    month: string;

    // State
    isLoading: boolean;
    error: string | null;
    showBalance: boolean;

    // Actions
    setMonth: (month: string) => void;
    toggleBalanceVisibility: () => void;
    refresh: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
    const [month, setMonth] = useState(() => {
        return new Date().toISOString().slice(0, 7); // YYYY-MM
    });
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [weeklySpending, setWeeklySpending] = useState<number[]>([0, 0, 0, 0]);
    const [dailySpending, setDailySpending] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
    const [monthlySpending, setMonthlySpending] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showBalance, setShowBalance] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/dashboard/stats?month=${month}`);

            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            const data = await response.json();

            setStats(data.stats);
            setAccounts(data.accounts || []);
            setRecentTransactions(data.recentTransactions || []);
            setWeeklySpending(data.weeklySpending || [0, 0, 0, 0]);
            setDailySpending(data.dailySpending || [0, 0, 0, 0, 0, 0, 0]);
            setMonthlySpending(data.monthlySpending || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            // Set default data on error
            setStats({
                income: { amount: 0, change: null },
                expense: { amount: 0, change: null },
                netProfit: { amount: 0, change: null },
                totalBalance: { amount: 0 },
            });
        } finally {
            setIsLoading(false);
        }
    }, [month]);

    const toggleBalanceVisibility = useCallback(() => {
        setShowBalance((prev) => !prev);
    }, []);

    const refresh = useCallback(async () => {
        await fetchDashboardData();
    }, [fetchDashboardData]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return {
        stats,
        accounts,
        recentTransactions,
        weeklySpending,
        dailySpending,
        monthlySpending,
        month,
        isLoading,
        error,
        showBalance,
        setMonth,
        toggleBalanceVisibility,
        refresh,
    };
}
