// =====================================================
// SINGLE CATEGORY API
// 
// GET    /api/categories/[id]  - Get category by ID
// PUT    /api/categories/[id]  - Update category
// DELETE /api/categories/[id]  - Delete category
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRowById, updateRow, deleteRow, SHEETS } from '@/lib/sheets';

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

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Get single category
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const category = await getRowById<Category>(SHEETS.CATEGORIES, 'categoryId', id);

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        if (category.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json({ category });
    } catch (error) {
        console.error('Error fetching category:', error);
        return NextResponse.json(
            { error: 'Failed to fetch category' },
            { status: 500 }
        );
    }
}

// PUT - Update category
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const category = await getRowById<Category>(SHEETS.CATEGORIES, 'categoryId', id);

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        if (category.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const updates: Partial<Category> = {};

        if (body.name !== undefined) updates.name = body.name;
        if (body.type !== undefined) updates.type = body.type;
        if (body.icon !== undefined) updates.icon = body.icon;
        if (body.color !== undefined) updates.color = body.color;
        if (body.parentCategoryId !== undefined) updates.parentCategoryId = body.parentCategoryId;

        const updatedCategory = await updateRow<Category>(
            SHEETS.CATEGORIES,
            'categoryId',
            id,
            updates
        );

        return NextResponse.json({ success: true, category: updatedCategory });
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json(
            { error: 'Failed to update category' },
            { status: 500 }
        );
    }
}

// DELETE - Delete category
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const category = await getRowById<Category>(SHEETS.CATEGORIES, 'categoryId', id);

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        if (category.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await deleteRow(SHEETS.CATEGORIES, 'categoryId', id);

        return NextResponse.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            { error: 'Failed to delete category' },
            { status: 500 }
        );
    }
}
