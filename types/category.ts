// =====================================================
// TYPE DEFINITIONS - CATEGORY
// =====================================================

export type CategoryType = 'income' | 'expense';

export interface Category {
    categoryId: string;
    userId: string; // 'global' for default categories
    name: string;
    type: CategoryType;
    icon?: string; // Emoji or icon name
    color?: string;
    parentCategoryId?: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: unknown; // Index signature for Record<string, unknown> compatibility
}

export interface CategoryFormData {
    name: string;
    type: CategoryType;
    icon?: string;
    color?: string;
    parentCategoryId?: string;
}

// Default categories
export const DEFAULT_INCOME_CATEGORIES = [
    { name: 'Salary', icon: '💰' },
    { name: 'Freelance', icon: '💻' },
    { name: 'Investments', icon: '📈' },
    { name: 'Other Income', icon: '🎁' },
];

export const DEFAULT_EXPENSE_CATEGORIES = [
    { name: 'Food & Drinks', icon: '🍔' },
    { name: 'Transport', icon: '🚗' },
    { name: 'Entertainment', icon: '🎬' },
    { name: 'Shopping', icon: '🛍️' },
    { name: 'Utilities', icon: '💡' },
    { name: 'Rent', icon: '🏠' },
    { name: 'Healthcare', icon: '🏥' },
    { name: 'Education', icon: '📚' },
];
