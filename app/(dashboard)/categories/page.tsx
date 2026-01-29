'use client';

import { useState } from 'react';
import { Icons } from '@/components/ui';
import { useCategories, Category } from '@/hooks';
import { CategoryListItem, CategoryModal } from '@/components/settings';
import { ConfirmModal } from '@/components/ui';
import { BottomNavigation } from '@/components/dashboard';
import { useLanguage } from '@/components/providers';

type CategoryTab = 'expense' | 'income';

export default function CategoriesPage() {
    const { t } = useLanguage();
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<CategoryTab>('expense');

    // Modal States
    const [isCatModalOpen, setIsCatModalOpen] = useState(false);

    // Delete State
    const [deletingItem, setDeletingItem] = useState<{ id: string, name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Edit States
    const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

    const {
        categories,
        expenseCategories,
        incomeCategories,
        isLoading,
        addCategory,
        updateCategory,
        deleteCategory
    } = useCategories();

    // Filter categories based on active tab
    const activeCategories = activeTab === 'expense' ? expenseCategories : incomeCategories;
    const filteredCategories = activeCategories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    // Show skeleton while loading
    if (isLoading) {
        return <CategoriesSkeleton />;
    }

    const handleAdd = () => {
        setEditingCategory(undefined);
        setIsCatModalOpen(true);
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setIsCatModalOpen(true);
    };

    const handleDeleteCategory = (category: Category) => {
        setDeletingItem({ id: category.categoryId, name: category.name });
    };

    const handleConfirmDelete = async () => {
        if (!deletingItem) return;
        setIsDeleting(true);
        try {
            await deleteCategory(deletingItem.id);
        } finally {
            setIsDeleting(false);
            setDeletingItem(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f0a] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sticky top-0 bg-[#0a0f0a]/95 backdrop-blur z-10">
                <h1 className="text-xl font-bold text-white">{t('categories.title')}</h1>
                <button
                    onClick={handleAdd}
                    className="w-9 h-9 rounded-lg bg-[#22c55e] flex items-center justify-center text-[#0a0f0a] hover:bg-[#16a34a] transition-colors"
                >
                    <Icons.Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 px-4 pb-24 overflow-y-auto">
                {/* Tab Toggle */}
                <div className="flex p-1 bg-[#1a2a1a] rounded-xl mb-4 border border-[#2a3f2a]">
                    <button
                        onClick={() => setActiveTab('expense')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                            activeTab === 'expense'
                                ? 'bg-[#ef4444]/20 text-[#ef4444]'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <Icons.ArrowUp className="w-4 h-4" />
                        {t('transactions.expense')}
                    </button>
                    <button
                        onClick={() => setActiveTab('income')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                            activeTab === 'income'
                                ? 'bg-[#22c55e]/20 text-[#22c55e]'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <Icons.ArrowDown className="w-4 h-4" />
                        {t('transactions.income')}
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('categories.search')}
                        className="w-full h-12 pl-10 pr-4 bg-[#1a2a1a] text-white rounded-xl border border-[#2a3f2a] focus:border-[#22c55e] focus:outline-none placeholder:text-gray-500 text-sm transition-all shadow-inner"
                    />
                </div>

                {/* Category List */}
                <div className="space-y-3">
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map(cat => (
                            <CategoryListItem
                                key={cat.categoryId}
                                category={cat}
                                onEdit={handleEditCategory}
                                onDelete={handleDeleteCategory}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-[#1a2a1a] flex items-center justify-center mb-4">
                                <Icons.Tag className="w-8 h-8 text-gray-600" />
                            </div>
                            <p className="text-white font-medium mb-1">{t('categories.noCategories')}</p>
                            <p className="text-sm text-gray-500 mb-4">
                                {activeTab === 'expense'
                                    ? 'Add expense categories to organize your spending'
                                    : 'Add income categories to track your earnings'}
                            </p>
                            <button
                                onClick={handleAdd}
                                className="px-6 py-2 bg-[#22c55e] text-[#0a0f0a] font-bold rounded-xl"
                            >
                                {t('categories.add')} {activeTab === 'expense' ? t('transactions.expense') : t('transactions.income')}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <CategoryModal
                isOpen={isCatModalOpen}
                onClose={() => setIsCatModalOpen(false)}
                onSave={async (data) => {
                    if (editingCategory) {
                        return await updateCategory(editingCategory.categoryId, data);
                    } else {
                        return await addCategory(data);
                    }
                }}
                initialData={editingCategory}
                categories={categories}
                type={activeTab}
            />

            <ConfirmModal
                isOpen={!!deletingItem}
                onClose={() => setDeletingItem(null)}
                onConfirm={handleConfirmDelete}
                title={t('categories.deleteCategory')}
                description={t('categories.deleteConfirm')}
                confirmText={t('common.delete')}
                isLoading={isDeleting}
            />

            {/* Mobile Nav */}
            <div className="lg:hidden">
                <BottomNavigation />
            </div>
        </div>
    );
}

// =====================================================
// SKELETON LOADER
// =====================================================

function CategoriesSkeleton() {
    return (
        <div className="min-h-screen bg-[#0a0f0a] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <div className="w-28 h-7 rounded bg-[#1a2a1a] animate-pulse" />
                <div className="w-9 h-9 rounded-lg bg-[#1a2a1a] animate-pulse" />
            </div>

            <div className="flex-1 px-4 pb-24">
                {/* Tab skeleton */}
                <div className="h-12 rounded-xl bg-[#1a2a1a] animate-pulse mb-4" />

                {/* Search skeleton */}
                <div className="h-12 rounded-xl bg-[#1a2a1a] animate-pulse mb-4" />

                {/* Categories skeleton */}
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-3 rounded-xl bg-[#1a2a1a] border border-[#2a3f2a] flex items-center gap-3 animate-pulse">
                            <div className="w-10 h-10 rounded-xl bg-[#2a3f2a]" />
                            <div className="flex-1">
                                <div className="w-24 h-4 rounded bg-[#2a3f2a] mb-1" />
                                <div className="w-16 h-3 rounded bg-[#2a3f2a]" />
                            </div>
                            <div className="w-6 h-6 rounded bg-[#2a3f2a]" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
