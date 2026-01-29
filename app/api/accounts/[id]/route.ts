// =====================================================
// SINGLE ACCOUNT API
// 
// GET    /api/accounts/[id]  - Get account by ID
// PUT    /api/accounts/[id]  - Update account
// DELETE /api/accounts/[id]  - Delete account
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRowById, updateRow, deleteRow, SHEETS } from '@/lib/sheets';

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

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Get single account
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const account = await getRowById<Account>(SHEETS.ACCOUNTS, 'accountId', id);

        if (!account) {
            return NextResponse.json({ error: 'Account not found' }, { status: 404 });
        }

        if (account.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json({ account });
    } catch (error) {
        console.error('Error fetching account:', error);
        return NextResponse.json(
            { error: 'Failed to fetch account' },
            { status: 500 }
        );
    }
}

// PUT - Update account
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const account = await getRowById<Account>(SHEETS.ACCOUNTS, 'accountId', id);

        if (!account) {
            return NextResponse.json({ error: 'Account not found' }, { status: 404 });
        }

        if (account.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const updates = {
            name: body.name,
            type: body.type,
            currency: body.currency,
            startingBalance: body.startingBalance !== undefined ? Number(body.startingBalance) : undefined,
            note: body.note,
            color: body.color,
        };

        // Remove undefined values
        Object.keys(updates).forEach((key) => {
            if (updates[key as keyof typeof updates] === undefined) {
                delete updates[key as keyof typeof updates];
            }
        });

        const updatedAccount = await updateRow<Account>(
            SHEETS.ACCOUNTS,
            'accountId',
            id,
            updates
        );

        return NextResponse.json({ success: true, account: updatedAccount });
    } catch (error) {
        console.error('Error updating account:', error);
        return NextResponse.json(
            { error: 'Failed to update account' },
            { status: 500 }
        );
    }
}

// DELETE - Delete account
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const account = await getRowById<Account>(SHEETS.ACCOUNTS, 'accountId', id);

        if (!account) {
            return NextResponse.json({ error: 'Account not found' }, { status: 404 });
        }

        if (account.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await deleteRow(SHEETS.ACCOUNTS, 'accountId', id);

        return NextResponse.json({ success: true, message: 'Account deleted' });
    } catch (error) {
        console.error('Error deleting account:', error);
        return NextResponse.json(
            { error: 'Failed to delete account' },
            { status: 500 }
        );
    }
}
