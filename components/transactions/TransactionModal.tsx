// =====================================================
// TRANSACTION MODAL
//
// Add/Edit transaction form with i18n support
// =====================================================

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Icons, Select } from '@/components/ui';
import { Transaction } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { useLanguage } from '@/components/providers';

type TransactionType = 'expense' | 'income';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Transaction>) => Promise<boolean>;
    initialData?: Transaction;
    defaultType?: TransactionType;
}

export function TransactionModal({ isOpen, onClose, onSave, initialData, defaultType = 'expense' }: TransactionModalProps) {
    const { t } = useLanguage();
    const [type, setType] = useState<TransactionType>('expense');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [parentCategoryId, setParentCategoryId] = useState('');
    const [subCategoryId, setSubCategoryId] = useState('');
    const [note, setNote] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Data Hooks
    const { incomeCategories, expenseCategories } = useCategories();

    const activeCategories = type === 'income' ? incomeCategories : expenseCategories;

    // Find selected parent and check for subcategories
    const selectedParent = activeCategories.find(c => c.categoryId === parentCategoryId);
    const hasSubcategories = selectedParent?.subcategories && selectedParent.subcategories.length > 0;

    // The actual categoryId to save (prefer subcategory if selected)
    const categoryId = subCategoryId || parentCategoryId;

    // Reset form when modal opens/closes or when editing different transaction
    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            // Handle legacy data - only accept valid types
            const txType: TransactionType = initialData.type === 'income' ? 'income' : 'expense';
            setType(txType);
            setAmount(initialData.amount.toString());
            setDate(initialData.date.split('T')[0]);
            setNote(initialData.note || '');
            // Category will be set in separate effect when categories load
        } else {
            // Default state for new transaction
            setType(defaultType);
            setAmount('');
            setDate(new Date().toISOString().split('T')[0]);
            setParentCategoryId('');
            setSubCategoryId('');
            setNote('');
        }
    }, [initialData, isOpen, defaultType]);

    // Set category when editing and categories are loaded
    useEffect(() => {
        if (!isOpen || !initialData?.categoryId) return;
        if (incomeCategories.length === 0 && expenseCategories.length === 0) return;

        const cats = initialData.type === 'income' ? incomeCategories : expenseCategories;
        const catId = initialData.categoryId;

        // Check if it's a parent category
        const isParent = cats.find(c => c.categoryId === catId);
        if (isParent) {
            setParentCategoryId(catId);
            setSubCategoryId('');
        } else {
            // Find parent of this subcategory
            for (const parent of cats) {
                const sub = parent.subcategories?.find(s => s.categoryId === catId);
                if (sub) {
                    setParentCategoryId(parent.categoryId);
                    setSubCategoryId(catId);
                    break;
                }
            }
        }
    }, [initialData, isOpen, incomeCategories, expenseCategories]);

    // Memoize parent category options for performance
    const parentOptions = useMemo(() =>
        activeCategories.map(c => ({
            value: c.categoryId,
            label: c.name,
            color: c.color
        })),
        [activeCategories]
    );

    // Memoize subcategory options for performance
    const subCategoryOptions = useMemo(() =>
        hasSubcategories && selectedParent?.subcategories
            ? selectedParent.subcategories.map(s => ({
                value: s.categoryId,
                label: s.name,
                color: s.color
            }))
            : [],
        [hasSubcategories, selectedParent]
    );

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount) return;

        // Validate max amount (8 digits: $99,999,999.99)
        const numAmount = parseFloat(amount);
        if (numAmount > 99999999.99) return;

        setIsSubmitting(true);
        const success = await onSave({
            type,
            amount: parseFloat(amount),
            date,
            categoryId,
            note,
        });
        setIsSubmitting(false);

        if (success) onClose();
    };

    const handleTypeChange = (newType: TransactionType) => {
        setType(newType);
        setParentCategoryId('');
        setSubCategoryId('');
    };

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="transaction-modal-title"
        >
            <div className="w-full max-w-md bg-[#0a0f0a] border border-[#1a2f1a] rounded-2xl p-5 sm:p-6 shadow-2xl animate-scale-up max-h-[85vh] overflow-y-auto overscroll-contain">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 id="transaction-modal-title" className="text-lg sm:text-xl font-bold text-white">
                        {initialData ? t('transactions.editTransaction') : t('transactions.newTransaction')}
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
                    {/* Type Toggle */}
                    <div className="flex p-1 bg-[#1a2a1a] rounded-xl mb-3 sm:mb-4" role="radiogroup" aria-label={t('transactions.category')}>
                        {(['expense', 'income'] as const).map((txType) => (
                            <button
                                key={txType}
                                type="button"
                                role="radio"
                                aria-checked={type === txType}
                                onClick={() => handleTypeChange(txType)}
                                className={`flex-1 py-2.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors touch-manipulation ${type === txType
                                    ? (txType === 'expense' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500')
                                    : 'text-gray-400 hover:text-white active:text-white'
                                    }`}
                            >
                                {t(`transactions.${txType}`)}
                            </button>
                        ))}
                    </div>

                    {/* Amount */}
                    <div>
                        <label htmlFor="amount-input" className="block text-sm font-medium text-gray-400 mb-1">
                            {t('transactions.amount')}
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true">$</span>
                            <input
                                id="amount-input"
                                type="number"
                                min="0"
                                max="99999999.99"
                                step="0.01"
                                value={amount}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    // Prevent values over 8 digits (99,999,999.99)
                                    if (parseFloat(val) > 99999999.99) return;
                                    setAmount(val);
                                }}
                                placeholder="0.00"
                                className="w-full h-11 sm:h-12 pl-8 pr-4 bg-[#1a2a1a] border border-[#2a3f2a] rounded-xl text-white text-lg font-bold focus:border-[#22c55e] focus:outline-none"
                                autoFocus
                                aria-describedby="amount-currency"
                            />
                            <span id="amount-currency" className="sr-only">{t('transactions.amount')} USD</span>
                        </div>
                    </div>

                    {/* Parent Category Select */}
                    <div>
                        <Select
                            label={t('transactions.category')}
                            value={parentCategoryId}
                            onChange={(val) => {
                                setParentCategoryId(val);
                                setSubCategoryId(''); // Reset subcategory when parent changes
                            }}
                            options={parentOptions}
                            placeholder={t('transactions.selectCategory')}
                        />
                    </div>

                    {/* Sub-category Select - Always visible, disabled when no subcategories */}
                    <div>
                        <Select
                            label={t('transactions.subCategory')}
                            value={subCategoryId}
                            onChange={setSubCategoryId}
                            options={subCategoryOptions}
                            placeholder={hasSubcategories ? t('transactions.selectSubCategory') : t('transactions.none')}
                            disabled={!hasSubcategories}
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label htmlFor="date-input" className="block text-sm font-medium text-gray-400 mb-1">
                            {t('transactions.date')}
                        </label>
                        <input
                            id="date-input"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full h-11 sm:h-12 px-4 bg-[#1a2a1a] border border-[#2a3f2a] rounded-xl text-white focus:border-[#22c55e] focus:outline-none [color-scheme:dark] appearance-none [-webkit-appearance:none]"
                            style={{ colorScheme: 'dark' }}
                        />
                    </div>

                    {/* Note */}
                    <div>
                        <label htmlFor="note-input" className="block text-sm font-medium text-gray-400 mb-1">
                            {t('transactions.noteOptional')}
                        </label>
                        <input
                            id="note-input"
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder={t('transactions.details')}
                            className="w-full h-11 sm:h-12 px-4 bg-[#1a2a1a] border border-[#2a3f2a] rounded-xl text-white focus:border-[#22c55e] focus:outline-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-11 sm:h-14 rounded-xl border border-[#2a3f2a] text-gray-400 hover:text-white active:text-white font-semibold text-sm sm:text-base active:scale-[0.98] transition-transform touch-manipulation"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !amount}
                            className="flex-1 h-11 sm:h-14 rounded-xl bg-[#22c55e] text-[#0a0f0a] font-bold text-sm sm:text-base hover:bg-[#16a34a] active:bg-[#16a34a] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform touch-manipulation"
                        >
                            {isSubmitting ? t('transactions.saving') : t('common.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
