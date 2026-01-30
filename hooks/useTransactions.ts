// =====================================================
// USE TRANSACTIONS HOOK
// 
// Fetches and manages transaction list with filtering
// =====================================================

'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Transaction {
    transactionId: string;
    userId: string;
    type: 'income' | 'expense';
    date: string;
    amount: number;
    currency: string;
    categoryId?: string;
    note?: string;
    tags?: string;
    receiptUrl?: string;
    createdAt?: string;
}

interface TransactionsStats {
    totalIncome: number;
    totalExpense: number;
}

interface Filters {
    type?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    period?: string; // 'today' | 'week' | 'month' | 'year' | 'custom'
}

interface UseTransactionsReturn {
    // Data
    transactions: Transaction[];
    stats: TransactionsStats;

    // State
    isLoading: boolean;
    error: string | null;
    filters: Filters;

    // Actions
    setFilters: (filters: Filters | ((prev: Filters) => Filters)) => void;
    refresh: () => Promise<void>;
    addTransaction: (data: Partial<Transaction>) => Promise<boolean>;
    updateTransaction: (id: string, data: Partial<Transaction>) => Promise<boolean>;
    deleteTransaction: (id: string) => Promise<boolean>;

    // Grouped Data Accessor (by date)
    groupedTransactions: Record<string, Transaction[]>;
}

export function useTransactions(): UseTransactionsReturn {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [filters, setFilters] = useState<Filters>({});

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        try {
            // Build query params
            const params = new URLSearchParams();
            if (filters.categoryId) params.append('categoryId', filters.categoryId);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.type) params.append('type', filters.type);

            const res = await fetch(`/api/transactions?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch transactions');

            const data = await res.json();
            setTransactions(data.transactions || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }, [filters.categoryId, filters.startDate, filters.endDate, filters.type]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const addTransaction = async (data: Partial<Transaction>) => {
        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create transaction');
            await fetchTransactions(); // Refresh list
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const updateTransaction = async (id: string, data: Partial<Transaction>) => {
        try {
            const res = await fetch(`/api/transactions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update transaction');
            await fetchTransactions();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const deleteTransaction = async (id: string) => {
        try {
            const res = await fetch(`/api/transactions/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                console.warn('Delete API might be missing', res.status);
                throw new Error('Failed to delete transaction');
            }
            await fetchTransactions();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    // Derived state: Stats
    const stats = transactions.reduce(
        (acc, t) => {
            if (t.type === 'income') acc.totalIncome += Number(t.amount);
            if (t.type === 'expense') acc.totalExpense += Number(t.amount);
            return acc;
        },
        { totalIncome: 0, totalExpense: 0 }
    );

    // Group by Date (Today, Yesterday, Date)
    const groupedTransactions = transactions
        .filter(t => {
            if (!filters.search) return true;
            const search = filters.search.toLowerCase();
            return t.note?.toLowerCase().includes(search) || t.amount.toString().includes(search);
        })
        .reduce((groups, t) => {
            const date = new Date(t.date);
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            let key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            if (date.toDateString() === today.toDateString()) key = 'Today';
            else if (date.toDateString() === yesterday.toDateString()) key = 'Yesterday';

            if (!groups[key]) groups[key] = [];
            groups[key].push(t);
            return groups;
        }, {} as Record<string, Transaction[]>);

    return {
        transactions,
        stats,
        isLoading,
        error,
        filters,
        setFilters,
        refresh: fetchTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        groupedTransactions,
    };
}
