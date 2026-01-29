// =====================================================
// CATEGORIES API
// 
// GET    /api/categories     - Get all user categories
// POST   /api/categories     - Create new category
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRowsWhere, addRow, SHEETS } from '@/lib/sheets';
import { generateId } from '@/lib/utils';

interface Category {
    categoryId: string;
    userId: string;
    name: string;
    type: 'income' | 'expense';
    icon: string;
    color: string;
    parentCategoryId: string;
    createdAt: string;
    updatedAt: string;
}

// GET - List all categories for current user
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const categories = await getRowsWhere<Category>(SHEETS.CATEGORIES, {
            userId: session.user.id,
        });

        return NextResponse.json({ categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

// POST - Create new category
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, type, icon = '📁', color = '#22c55e', parentCategoryId = '' } = body;

        if (!name || !type) {
            return NextResponse.json(
                { error: 'Name and type are required' },
                { status: 400 }
            );
        }

        if (!['income', 'expense'].includes(type)) {
            return NextResponse.json(
                { error: 'Type must be "income" or "expense"' },
                { status: 400 }
            );
        }

        const newCategory: Category = {
            categoryId: generateId('cat'),
            userId: session.user.id,
            name,
            type,
            icon,
            color,
            parentCategoryId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await addRow(SHEETS.CATEGORIES, newCategory);

        return NextResponse.json(
            { success: true, category: newCategory },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        );
    }
}
