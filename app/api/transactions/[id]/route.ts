// =====================================================
// SINGLE TRANSACTION API
// 
// GET    /api/transactions/[id]  - Get transaction by ID
// PUT    /api/transactions/[id]  - Update transaction
// DELETE /api/transactions/[id]  - Delete transaction
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRowById, updateRow, deleteRow, SHEETS } from '@/lib/sheets';

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

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Get single transaction
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const transaction = await getRowById<Transaction>(SHEETS.TRANSACTIONS, 'transactionId', id);

        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        if (transaction.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json({ transaction });
    } catch (error) {
        console.error('Error fetching transaction:', error);
        return NextResponse.json(
            { error: 'Failed to fetch transaction' },
            { status: 500 }
        );
    }
}

// PUT - Update transaction
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const transaction = await getRowById<Transaction>(SHEETS.TRANSACTIONS, 'transactionId', id);

        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        if (transaction.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const updates: Partial<Transaction> = {};

        if (body.type !== undefined) updates.type = body.type;
        if (body.date !== undefined) updates.date = body.date;
        if (body.amount !== undefined) updates.amount = Number(body.amount);
        if (body.currency !== undefined) updates.currency = body.currency;
        if (body.accountId !== undefined) updates.accountId = body.accountId;
        if (body.categoryId !== undefined) updates.categoryId = body.categoryId;
        if (body.fromAccountId !== undefined) updates.fromAccountId = body.fromAccountId;
        if (body.toAccountId !== undefined) updates.toAccountId = body.toAccountId;
        if (body.note !== undefined) updates.note = body.note;
        if (body.tags !== undefined) {
            updates.tags = Array.isArray(body.tags) ? body.tags.join(',') : body.tags;
        }
        if (body.receiptUrl !== undefined) updates.receiptUrl = body.receiptUrl;

        const updatedTransaction = await updateRow<Transaction>(
            SHEETS.TRANSACTIONS,
            'transactionId',
            id,
            updates
        );

        return NextResponse.json({ success: true, transaction: updatedTransaction });
    } catch (error) {
        console.error('Error updating transaction:', error);
        return NextResponse.json(
            { error: 'Failed to update transaction' },
            { status: 500 }
        );
    }
}

// DELETE - Delete transaction
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const transaction = await getRowById<Transaction>(SHEETS.TRANSACTIONS, 'transactionId', id);

        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        if (transaction.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await deleteRow(SHEETS.TRANSACTIONS, 'transactionId', id);

        return NextResponse.json({ success: true, message: 'Transaction deleted' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        return NextResponse.json(
            { error: 'Failed to delete transaction' },
            { status: 500 }
        );
    }
}
