// =====================================================
// CATEGORY MODAL
//
// Add/Edit category form with i18n support
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import { Icons, Select } from '@/components/ui';
import { Category } from '@/hooks/useCategories';
import { useLanguage } from '@/components/providers';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Category>) => Promise<boolean>;
    categories: Category[];
    initialData?: Category;
    type?: 'expense' | 'income';
}

export function CategoryModal({ isOpen, onClose, onSave, categories, initialData, type = 'expense' }: CategoryModalProps) {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [selectedType, setSelectedType] = useState<'expense' | 'income'>(type);
    const [parentCategoryId, setParentCategoryId] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setSelectedType(initialData.type);
            setParentCategoryId(initialData.parentCategoryId || '');
        } else {
            setName('');
            setSelectedType(type);
            setParentCategoryId('');
        }
    }, [initialData, type, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        const success = await onSave({
            name,
            type: selectedType,
            parentCategoryId: parentCategoryId || undefined
        });
        setIsSubmitting(false);

        if (success) onClose();
    };

    // Filter potential parents
    const potentialParents = categories.filter(c =>
        c.type === selectedType &&
        c.categoryId !== initialData?.categoryId &&
        !c.parentCategoryId
    ).map(c => ({
        value: c.categoryId,
        label: c.name,
        color: c.color
    }));

    // Add "None" option
    const parentOptions = [
        { value: '', label: t('categories.noneTopLevel'), color: undefined },
        ...potentialParents
    ];

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-modal-title"
        >
            <div className="w-full max-w-md bg-[#0a0f0a] border border-[#1a2f1a] rounded-2xl p-5 sm:p-6 shadow-2xl animate-scale-up max-h-[85vh] overflow-y-auto overscroll-contain">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 id="category-modal-title" className="text-lg sm:text-xl font-bold text-white">
                        {initialData ? t('categories.editCategory') : t('categories.newCategory')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white p-1"
                        aria-label={t('common.cancel')}
                    >
                        <Icons.X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {/* Type Selection */}
                    <div className="flex p-1 bg-[#1a2a1a] rounded-xl" role="radiogroup" aria-label={t('transactions.category')}>
                        <button
                            type="button"
                            role="radio"
                            aria-checked={selectedType === 'expense'}
                            onClick={() => {
                                setSelectedType('expense');
                                setParentCategoryId('');
                            }}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                                selectedType === 'expense'
                                    ? 'bg-[#ef4444]/20 text-[#ef4444]'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {t('transactions.expense')}
                        </button>
                        <button
                            type="button"
                            role="radio"
                            aria-checked={selectedType === 'income'}
                            onClick={() => {
                                setSelectedType('income');
                                setParentCategoryId('');
                            }}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                                selectedType === 'income'
                                    ? 'bg-[#22c55e]/20 text-[#22c55e]'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {t('transactions.income')}
                        </button>
                    </div>

                    {/* Name Input */}
                    <div>
                        <label htmlFor="category-name" className="block text-sm font-medium text-gray-400 mb-1">
                            {t('categories.name')}
                        </label>
                        <input
                            id="category-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('categories.namePlaceholder')}
                            className="w-full h-11 sm:h-12 px-4 bg-[#1a2a1a] border border-[#2a3f2a] rounded-xl text-white focus:border-[#22c55e] focus:outline-none"
                            autoFocus
                        />
                    </div>

                    {/* Parent Category Select */}
                    <div>
                        <Select
                            label={t('categories.parentCategory')}
                            value={parentCategoryId}
                            onChange={setParentCategoryId}
                            options={parentOptions}
                            placeholder={t('categories.selectParent')}
                        />
                        <p className="text-xs text-gray-600 mt-1">{t('categories.parentHint')}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-3 sm:pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-12 sm:h-14 rounded-xl border border-[#2a3f2a] text-gray-400 hover:text-white font-semibold text-base active:scale-[0.98] transition-transform"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !name.trim()}
                            className="flex-1 h-12 sm:h-14 rounded-xl bg-[#22c55e] text-[#0a0f0a] font-bold text-base hover:bg-[#16a34a] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
                        >
                            {isSubmitting ? t('transactions.saving') : t('common.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
