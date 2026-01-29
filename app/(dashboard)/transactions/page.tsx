'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTransactions, useCategories, Transaction } from '@/hooks';
import { TransactionFilterBar, TransactionItem, TransactionModal, TransactionsSkeleton } from '@/components/transactions';
import { Icons, ConfirmModal } from '@/components/ui';
import { BottomNavigation } from '@/components/dashboard';
import { useLanguage } from '@/components/providers';

export default function TransactionsPage() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const router = useRouter();
    const {
        groupedTransactions,
        isLoading,
        filters,
        setFilters,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        refresh
    } = useTransactions();

    const { categories } = useCategories();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTx, setEditingTx] = useState<Transaction | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [defaultType, setDefaultType] = useState<'expense' | 'income'>('expense');

    // Handle query params for opening modal with specific type
    useEffect(() => {
        const action = searchParams.get('action');
        const type = searchParams.get('type');

        if (action === 'add') {
            if (type === 'income' || type === 'expense') {
                setDefaultType(type);
            }
            setIsModalOpen(true);
            // Clear query params after opening modal
            router.replace('/transactions', { scroll: false });
        }
    }, [searchParams, router]);

    // Helper Name Lookups
    const getCategoryName = (id?: string) => categories.find(c => c.categoryId === id)?.name || t('common.uncategorized');

    const handleSearch = (val: string) => {
        setFilters((prev) => ({ ...prev, search: val }));
    };

    const handleEdit = (tx: Transaction) => {
        setEditingTx(tx);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTx(null);
    };

    return (
        <div className="min-h-screen bg-[#0a0f0a] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sticky top-0 bg-[#0a0f0a]/95 backdrop-blur z-20">
                <h1 className="text-xl font-bold text-white">{t('transactions.title')}</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-9 h-9 rounded-lg bg-[#22c55e] flex items-center justify-center text-[#0a0f0a] hover:bg-[#16a34a] transition-colors"
                >
                    <Icons.Plus className="w-5 h-5" />
                </button>
            </div>

            <TransactionFilterBar
                search={filters.search || ''}
                onSearchChange={handleSearch}
                filters={filters}
                onFilterChange={(key, val) => setFilters(prev => ({ ...prev, [key]: val }))}
                categories={categories.map(c => ({ id: c.categoryId, name: c.name }))}
            />

            <div className="flex-1 px-2 pb-24 overflow-y-auto">
                {isLoading ? (
                    <TransactionsSkeleton />
                ) : Object.keys(groupedTransactions).length > 0 ? (
                    <div className="space-y-6 pt-4">
                        {Object.entries(groupedTransactions).map(([dateLabel, txs]) => (
                            <div key={dateLabel}>
                                <h3 className="px-6 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest sticky top-0 bg-[#0a0f0a] z-0">
                                    {dateLabel}
                                </h3>
                                <div className="space-y-1">
                                    {txs.map(tx => (
                                        <TransactionItem
                                            key={tx.transactionId}
                                            note={tx.note || ''}
                                            categoryName={getCategoryName(tx.categoryId)}
                                            amount={tx.amount}
                                            type={tx.type}
                                            onEdit={() => handleEdit(tx)}
                                            onDelete={() => handleDelete(tx.transactionId)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-[#1a2a1a] flex items-center justify-center mb-4">
                            <Icons.Receipt className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="text-white font-medium mb-1">{t('transactions.noTransactions')}</p>
                        <p className="text-sm text-gray-500 mb-4">{t('transactions.tryAdjusting')}</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-2 bg-[#22c55e] text-[#0a0f0a] font-bold rounded-xl"
                        >
                            {t('transactions.addTransaction')}
                        </button>
                    </div>
                )}
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                initialData={editingTx || undefined}
                defaultType={defaultType}
                onClose={handleCloseModal}
                onSave={async (data) => {
                    if (editingTx) {
                        return await updateTransaction(editingTx.transactionId, data);
                    } else {
                        return await addTransaction(data);
                    }
                }}
            />

            <ConfirmModal
                isOpen={!!deleteId}
                title={t('transactions.deleteTransaction')}
                description={t('transactions.deleteConfirm')}
                onClose={() => setDeleteId(null)}
                onConfirm={async () => {
                    if (deleteId) {
                        await deleteTransaction(deleteId);
                        setDeleteId(null);
                    }
                }}
            />

            <div className="lg:hidden">
                <BottomNavigation />
            </div>
        </div>
    );
}
