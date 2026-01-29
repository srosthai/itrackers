// =====================================================
// TRANSACTIONS API
// 
// GET    /api/transactions   - Get all user transactions
// POST   /api/transactions   - Create new transaction
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRowsWhere, addRow, SHEETS } from '@/lib/sheets';
import { generateId } from '@/lib/utils';

interface Transaction {
    transactionId: string;
    userId: string;
    type: 'income' | 'expense' | 'transfer';
    date: string;
    amount: number;
    currency: string;
    accountId: string;
    categoryId: string;
    fromAccountId: string;
    toAccountId: string;
    note: string;
    tags: string;
    receiptUrl: string;
    createdAt: string;
    updatedAt: string;
}

// GET - List all transactions for current user
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');
        const type = searchParams.get('type'); // income, expense, transfer
        const accountId = searchParams.get('accountId');
        const categoryId = searchParams.get('categoryId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        let transactions = await getRowsWhere<Transaction>(SHEETS.TRANSACTIONS, {
            userId: session.user.id,
        });

        // Apply filters
        if (type) {
            transactions = transactions.filter((t) => t.type === type);
        }
        if (accountId) {
            transactions = transactions.filter((t) => t.accountId === accountId);
        }
        if (categoryId) {
            transactions = transactions.filter((t) => t.categoryId === categoryId);
        }
        if (startDate) {
            transactions = transactions.filter((t) => t.date >= startDate);
        }
        if (endDate) {
            transactions = transactions.filter((t) => t.date <= endDate);
        }

        // Sort by date (newest first)
        transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Apply pagination
        const total = transactions.length;
        transactions = transactions.slice(offset, offset + limit);

        return NextResponse.json({
            transactions,
            pagination: { total, limit, offset },
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
}

// POST - Create new transaction
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            type,
            date,
            amount,
            currency = 'USD',
            accountId,
            categoryId = '',
            fromAccountId = '',
            toAccountId = '',
            note = '',
            tags = '',
            receiptUrl = '',
        } = body;

        // Validation
        if (!type || !date || amount === undefined) {
            return NextResponse.json(
                { error: 'Type, date, and amount are required' },
                { status: 400 }
            );
        }

        if (!['income', 'expense', 'transfer'].includes(type)) {
            return NextResponse.json(
                { error: 'Type must be "income", "expense", or "transfer"' },
                { status: 400 }
            );
        }

        if (type === 'transfer' && (!fromAccountId || !toAccountId)) {
            return NextResponse.json(
                { error: 'Transfer requires fromAccountId and toAccountId' },
                { status: 400 }
            );
        }

        if (['income', 'expense'].includes(type) && !accountId) {
            return NextResponse.json(
                { error: 'AccountId is required for income/expense' },
                { status: 400 }
            );
        }

        const newTransaction: Transaction = {
            transactionId: generateId('txn'),
            userId: session.user.id,
            type,
            date,
            amount: Number(amount),
            currency,
            accountId: accountId || '',
            categoryId,
            fromAccountId,
            toAccountId,
            note,
            tags: Array.isArray(tags) ? tags.join(',') : tags,
            receiptUrl,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await addRow(SHEETS.TRANSACTIONS, newTransaction);

        return NextResponse.json(
            { success: true, transaction: newTransaction },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating transaction:', error);
        return NextResponse.json(
            { error: 'Failed to create transaction' },
            { status: 500 }
        );
    }
}
