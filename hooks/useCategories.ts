// =====================================================
// USE CATEGORIES HOOK
// 
// Fetches and manages transaction categories
// =====================================================

'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Category {
    categoryId: string;
    name: string;
    type: 'income' | 'expense';
    icon?: string;
    color?: string;
    parentCategoryId?: string;
    // Subcategories logic will be handled in hook
    subcategories?: Category[];
}

interface UseCategoriesReturn {
    categories: Category[];
    expenseCategories: Category[];
    incomeCategories: Category[];
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    addCategory: (data: Partial<Category>) => Promise<boolean>;
    updateCategory: (id: string, data: Partial<Category>) => Promise<boolean>;
    deleteCategory: (id: string) => Promise<boolean>;
}

export function useCategories(): UseCategoriesReturn {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/categories');
            if (!res.ok) throw new Error('Failed to fetch categories');

            const data = await res.json();
            // Assign default colors/icons client-side based on type
            const enrichedCategories = (data.categories || []).map((c: any) => ({
                ...c,
                icon: c.icon || 'Tag', // Default icon
                color: c.color || (c.type === 'income' ? '#22c55e' : '#ef4444') // Green for Income, Red for Expense
            }));
            setCategories(enrichedCategories);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const addCategory = async (data: Partial<Category>) => {
        try {
            // Remove icon/color from payload as they are not in DB
            const { icon, color, ...payload } = data;

            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Failed to create category');
            await fetchCategories();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const updateCategory = async (id: string, data: Partial<Category>) => {
        try {
            // Remove icon/color from payload
            const { icon, color, ...payload } = data;

            const res = await fetch(`/api/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Failed to update category');
            await fetchCategories();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete category');
            await fetchCategories();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    // Helper function to build nested category structure
    const buildNestedCategories = (cats: Category[]): Category[] => {
        // Get all parent categories (those without parentCategoryId)
        const parentCats = cats.filter(c => !c.parentCategoryId);

        // Attach subcategories to their parents
        return parentCats.map(parent => ({
            ...parent,
            subcategories: cats.filter(c => c.parentCategoryId === parent.categoryId)
        }));
    };

    // Derived state: Split by type and build nested structure
    const expenseCategories = buildNestedCategories(categories.filter(c => c.type === 'expense'));
    const incomeCategories = buildNestedCategories(categories.filter(c => c.type === 'income'));

    return {
        categories,
        expenseCategories,
        incomeCategories,
        isLoading,
        error,
        refresh: fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory,
    };
}
