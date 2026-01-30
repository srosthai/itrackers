'use client';

import { useState } from 'react';
import { Icons, ConfirmModal } from '@/components/ui';
import { useCategories, Category } from '@/hooks';
import { CategoryListItem, CategoryModal } from '@/components/categories';
import { BottomNavigation, FloatingActionButton } from '@/components/dashboard';
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
        <div className="min-h-[100dvh] bg-[#0a0f0a] flex flex-col">
            {/* Header */}
            <div className="flex items-center p-4 sticky top-0 bg-[#0a0f0a]/95 backdrop-blur z-10">
                <h1 className="text-xl font-bold text-white">{t('categories.title')}</h1>
            </div>

            <div className="flex-1 px-3 sm:px-4 pb-28 sm:pb-24 overflow-y-auto">
                {/* Tab Toggle */}
                <div className="flex p-1 bg-[#1a2a1a] rounded-xl mb-3 sm:mb-4 border border-[#2a3f2a]">
                    <button
                        onClick={() => setActiveTab('expense')}
                        className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all touch-manipulation ${
                            activeTab === 'expense'
                                ? 'bg-[#ef4444]/20 text-[#ef4444]'
                                : 'text-gray-400 hover:text-white active:text-white'
                        }`}
                    >
                        <Icons.ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        {t('transactions.expense')}
                    </button>
                    <button
                        onClick={() => setActiveTab('income')}
                        className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all touch-manipulation ${
                            activeTab === 'income'
                                ? 'bg-[#22c55e]/20 text-[#22c55e]'
                                : 'text-gray-400 hover:text-white active:text-white'
                        }`}
                    >
                        <Icons.ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        {t('transactions.income')}
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-3 sm:mb-4">
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('categories.search')}
                        className="w-full h-10 sm:h-12 pl-9 sm:pl-10 pr-4 bg-[#1a2a1a] text-white rounded-xl border border-[#2a3f2a] focus:border-[#22c55e] focus:outline-none placeholder:text-gray-500 text-xs sm:text-sm transition-all shadow-inner"
                    />
                </div>

                {/* Category List */}
                <div className="space-y-2 sm:space-y-3">
                    {isLoading ? (
                        // Skeleton items while loading
                        Array.from({ length: 5 }).map((_, i) => (
                            <CategoryItemSkeleton key={i} delay={i * 100} />
                        ))
                    ) : filteredCategories.length > 0 ? (
                        filteredCategories.map(cat => (
                            <CategoryListItem
                                key={cat.categoryId}
                                category={cat}
                                onEdit={handleEditCategory}
                                onDelete={handleDeleteCategory}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 sm:py-12 text-center px-4">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1a2a1a] flex items-center justify-center mb-3 sm:mb-4">
                                <Icons.Tag className="w-7 h-7 sm:w-8 sm:h-8 text-gray-600" />
                            </div>
                            <p className="text-white font-medium mb-1 text-sm sm:text-base">{t('categories.noCategories')}</p>
                            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                                {activeTab === 'expense'
                                    ? 'Add expense categories to organize your spending'
                                    : 'Add income categories to track your earnings'}
                            </p>
                            <button
                                onClick={handleAdd}
                                className="px-5 sm:px-6 py-2 bg-[#22c55e] text-[#0a0f0a] font-bold rounded-xl text-sm sm:text-base active:bg-[#16a34a] transition-colors touch-manipulation"
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
                <FloatingActionButton onClick={handleAdd} />
                <BottomNavigation />
            </div>
        </div>
    );
}

// =====================================================
// SKELETON LOADER (Item Only)
// =====================================================

function CategoryItemSkeleton({ delay = 0 }: { delay?: number }) {
    return (
        <div
            className="p-3 rounded-xl bg-[#1a2a1a] border border-[#2a3f2a] flex items-center gap-3"
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-[#2a3f2a] animate-pulse" />

            {/* Name & Subcategory */}
            <div className="flex-1 min-w-0">
                <div className="w-24 h-4 rounded bg-[#2a3f2a] mb-1.5 animate-pulse" />
                <div className="w-16 h-3 rounded bg-[#2a3f2a]/50 animate-pulse" />
            </div>

            {/* Amount */}
            <div className="w-16 h-4 rounded bg-[#2a3f2a]/60 animate-pulse" />

            {/* Action Button */}
            <div className="w-8 h-8 rounded-lg bg-[#2a3f2a]/50 animate-pulse" />
        </div>
    );
}
