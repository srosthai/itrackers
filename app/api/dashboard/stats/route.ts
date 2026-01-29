// =====================================================
// DASHBOARD STATS API
// 
// GET /api/dashboard/stats - Get dashboard statistics
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRowsWhere, SHEETS } from '@/lib/sheets';

interface Transaction {
    transactionId: string;
    userId: string;
    type: 'income' | 'expense' | 'transfer';
    date: string;
    amount: number;
    accountId: string;
    categoryId: string;
}

interface Account {
    accountId: string;
    userId: string;
    name: string;
    startingBalance: number;
}

// GET - Get dashboard statistics
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month') || new Date().toISOString().slice(0, 7); // YYYY-MM

        // Get all user transactions
        const allTransactions = await getRowsWhere<Transaction>(SHEETS.TRANSACTIONS, {
            userId: session.user.id,
        });

        // Filter transactions for the specified month
        const monthTransactions = allTransactions.filter((t) => t.date.startsWith(month));

        // Calculate totals
        const income = monthTransactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const expense = monthTransactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const netProfit = income - expense;

        // Get accounts and calculate total balance
        const accounts = await getRowsWhere<Account>(SHEETS.ACCOUNTS, {
            userId: session.user.id,
        });

        // Calculate account balances (starting balance + income - expenses for each account)
        const accountBalances = accounts.map((account) => {
            const accountTransactions = allTransactions.filter((t) => t.accountId === account.accountId);

            const accountIncome = accountTransactions
                .filter((t) => t.type === 'income')
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const accountExpense = accountTransactions
                .filter((t) => t.type === 'expense')
                .reduce((sum, t) => sum + Number(t.amount), 0);

            return {
                ...account,
                currentBalance: Number(account.startingBalance) + accountIncome - accountExpense,
            };
        });

        const totalBalance = accountBalances.reduce((sum, a) => sum + a.currentBalance, 0);

        // Calculate previous month for comparison
        const prevMonth = new Date(month + '-01');
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        const prevMonthStr = prevMonth.toISOString().slice(0, 7);

        const prevMonthTransactions = allTransactions.filter((t) => t.date.startsWith(prevMonthStr));

        const prevIncome = prevMonthTransactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const prevExpense = prevMonthTransactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        // Calculate percentage changes
        const incomeChange = prevIncome > 0 ? ((income - prevIncome) / prevIncome) * 100 : 0;
        const expenseChange = prevExpense > 0 ? ((expense - prevExpense) / prevExpense) * 100 : 0;

        // Get recent transactions (last 10)
        const recentTransactions = allTransactions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10);

        return NextResponse.json({
            month,
            stats: {
                income: { amount: income, change: incomeChange },
                expense: { amount: expense, change: expenseChange },
                netProfit: { amount: netProfit },
                totalBalance: { amount: totalBalance },
            },
            accounts: accountBalances,
            recentTransactions,
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard stats' },
            { status: 500 }
        );
    }
}
