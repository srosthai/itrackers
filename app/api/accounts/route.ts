// =====================================================
// ACCOUNTS API
// 
// GET    /api/accounts       - Get all user accounts
// POST   /api/accounts       - Create new account
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAllRows, getRowsWhere, addRow, SHEETS } from '@/lib/sheets';
import { generateId } from '@/lib/utils';

interface Account {
    accountId: string;
    userId: string;
    name: string;
    type: string;
    currency: string;
    startingBalance: number;
    note: string;
    color: string;
    createdAt: string;
    updatedAt: string;
}

// GET - List all accounts for current user
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const accounts = await getRowsWhere<Account>(SHEETS.ACCOUNTS, {
            userId: session.user.id,
        });

        return NextResponse.json({ accounts });
    } catch (error) {
        console.error('Error fetching accounts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch accounts' },
            { status: 500 }
        );
    }
}

// POST - Create new account
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, type, currency = 'USD', startingBalance = 0, note = '', color = '#22c55e' } = body;

        if (!name || !type) {
            return NextResponse.json(
                { error: 'Name and type are required' },
                { status: 400 }
            );
        }

        const newAccount: Account = {
            accountId: generateId('acc'),
            userId: session.user.id,
            name,
            type,
            currency,
            startingBalance: Number(startingBalance),
            note,
            color,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await addRow(SHEETS.ACCOUNTS, newAccount);

        return NextResponse.json(
            { success: true, account: newAccount },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating account:', error);
        return NextResponse.json(
            { error: 'Failed to create account' },
            { status: 500 }
        );
    }
}
