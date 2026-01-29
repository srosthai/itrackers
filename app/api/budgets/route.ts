// =====================================================
// BUDGETS API
// 
// GET    /api/budgets        - Get all user budgets
// POST   /api/budgets        - Create new budget
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRowsWhere, addRow, SHEETS } from '@/lib/sheets';
import { generateId } from '@/lib/utils';

interface Budget {
    budgetId: string;
    userId: string;
    month: string; // Format: YYYY-MM
    categoryId: string;
    limitAmount: number;
    createdAt: string;
    updatedAt: string;
}

// GET - List all budgets for current user
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month'); // Filter by month (YYYY-MM)

        let budgets = await getRowsWhere<Budget>(SHEETS.BUDGETS, {
            userId: session.user.id,
        });

        if (month) {
            budgets = budgets.filter((b) => b.month === month);
        }

        return NextResponse.json({ budgets });
    } catch (error) {
        console.error('Error fetching budgets:', error);
        return NextResponse.json(
            { error: 'Failed to fetch budgets' },
            { status: 500 }
        );
    }
}

// POST - Create new budget
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { month, categoryId, limitAmount } = body;

        if (!month || !categoryId || limitAmount === undefined) {
            return NextResponse.json(
                { error: 'Month, categoryId, and limitAmount are required' },
                { status: 400 }
            );
        }

        // Check if budget already exists for this category and month
        const existingBudgets = await getRowsWhere<Budget>(SHEETS.BUDGETS, {
            userId: session.user.id,
        });

        const duplicate = existingBudgets.find(
            (b) => b.month === month && b.categoryId === categoryId
        );

        if (duplicate) {
            return NextResponse.json(
                { error: 'Budget already exists for this category and month' },
                { status: 409 }
            );
        }

        const newBudget: Budget = {
            budgetId: generateId('bud'),
            userId: session.user.id,
            month,
            categoryId,
            limitAmount: Number(limitAmount),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await addRow(SHEETS.BUDGETS, newBudget);

        return NextResponse.json(
            { success: true, budget: newBudget },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating budget:', error);
        return NextResponse.json(
            { error: 'Failed to create budget' },
            { status: 500 }
        );
    }
}
