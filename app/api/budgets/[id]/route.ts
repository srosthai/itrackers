// =====================================================
// SINGLE BUDGET API
// 
// GET    /api/budgets/[id]  - Get budget by ID
// PUT    /api/budgets/[id]  - Update budget
// DELETE /api/budgets/[id]  - Delete budget
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRowById, updateRow, deleteRow, SHEETS } from '@/lib/sheets';

interface Budget {
    budgetId: string;
    userId: string;
    month: string;
    categoryId: string;
    limitAmount: number;
    createdAt: string;
    updatedAt: string;
}

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Get single budget
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const budget = await getRowById<Budget>(SHEETS.BUDGETS, 'budgetId', id);

        if (!budget) {
            return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
        }

        if (budget.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json({ budget });
    } catch (error) {
        console.error('Error fetching budget:', error);
        return NextResponse.json(
            { error: 'Failed to fetch budget' },
            { status: 500 }
        );
    }
}

// PUT - Update budget
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const budget = await getRowById<Budget>(SHEETS.BUDGETS, 'budgetId', id);

        if (!budget) {
            return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
        }

        if (budget.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const updates: Partial<Budget> = {};

        if (body.month !== undefined) updates.month = body.month;
        if (body.categoryId !== undefined) updates.categoryId = body.categoryId;
        if (body.limitAmount !== undefined) updates.limitAmount = Number(body.limitAmount);

        const updatedBudget = await updateRow<Budget>(
            SHEETS.BUDGETS,
            'budgetId',
            id,
            updates
        );

        return NextResponse.json({ success: true, budget: updatedBudget });
    } catch (error) {
        console.error('Error updating budget:', error);
        return NextResponse.json(
            { error: 'Failed to update budget' },
            { status: 500 }
        );
    }
}

// DELETE - Delete budget
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const budget = await getRowById<Budget>(SHEETS.BUDGETS, 'budgetId', id);

        if (!budget) {
            return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
        }

        if (budget.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await deleteRow(SHEETS.BUDGETS, 'budgetId', id);

        return NextResponse.json({ success: true, message: 'Budget deleted' });
    } catch (error) {
        console.error('Error deleting budget:', error);
        return NextResponse.json(
            { error: 'Failed to delete budget' },
            { status: 500 }
        );
    }
}
