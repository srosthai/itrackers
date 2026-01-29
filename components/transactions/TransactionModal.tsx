// =====================================================
// TRANSACTION MODAL
// 
// Add/Edit transaction form
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import { Icons, Select } from '@/components/ui';
import { Transaction } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Transaction>) => Promise<boolean>;
    initialData?: Transaction;
    defaultType?: 'expense' | 'income';
}

export function TransactionModal({ isOpen, onClose, onSave, initialData, defaultType = 'expense' }: TransactionModalProps) {
    const [type, setType] = useState<'expense' | 'income'>('expense');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [categoryId, setCategoryId] = useState('');
    const [note, setNote] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Data Hooks
    const { incomeCategories, expenseCategories } = useCategories();

    useEffect(() => {
        if (initialData) {
            // @ts-ignore - Ignore transfer type if it exists in old data
            setType(initialData.type === 'transfer' ? 'expense' : initialData.type);
            setAmount(initialData.amount.toString());
            setDate(initialData.date.split('T')[0]);
            setCategoryId(initialData.categoryId || '');
            setNote(initialData.note || '');
        } else {
            // Default state
            setType(defaultType);
            setAmount('');
            setDate(new Date().toISOString().split('T')[0]);
            setCategoryId('');
            setNote('');
        }
    }, [initialData, isOpen, defaultType]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount) return;

        setIsSubmitting(true);
        const success = await onSave({
            type,
            amount: parseFloat(amount),
            date,
            categoryId,
            note,
            accountId: null, // Explicitly null
        } as any);
        setIsSubmitting(false);

        if (success) onClose();
    };

    const activeCategories = type === 'income' ? incomeCategories : expenseCategories;
    const categoryOptions = activeCategories.map(c => ({
        value: c.categoryId,
        label: c.name,
        color: c.color
    }));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#0a0f0a] border border-[#1a2f1a] rounded-2xl p-6 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto noscroll">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">
                        {initialData ? 'Edit Transaction' : 'New Transaction'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <Icons.X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Type Toggle */}
                    <div className="flex p-1 bg-[#1a2a1a] rounded-xl mb-4">
                        {['expense', 'income'].map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => {
                                    setType(t as any);
                                    setCategoryId(''); // Reset category on type change
                                }}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${type === t
                                    ? (t === 'expense' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500')
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full h-12 pl-8 pr-4 bg-[#1a2a1a] border border-[#2a3f2a] rounded-xl text-white text-lg font-bold focus:border-[#22c55e] focus:outline-none"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Category Select */}
                    <div>
                        <Select
                            label="Category"
                            value={categoryId}
                            onChange={setCategoryId}
                            options={categoryOptions}
                            placeholder="Select Category"
                        />
                    </div>

                    {/* Date & Note */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full h-12 px-4 bg-[#1a2a1a] border border-[#2a3f2a] rounded-xl text-white focus:border-[#22c55e] focus:outline-none [color-scheme:dark]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Note (Optional)</label>
                            <input
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Details..."
                                className="w-full h-12 px-4 bg-[#1a2a1a] border border-[#2a3f2a] rounded-xl text-white focus:border-[#22c55e] focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl border border-[#2a3f2a] text-gray-400 hover:text-white font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !amount}
                            className="flex-1 h-12 rounded-xl bg-[#22c55e] text-[#0a0f0a] font-bold hover:bg-[#16a34a] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
