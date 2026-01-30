'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTransactions, useCategories, Transaction } from '@/hooks';
import { TransactionFilterBar, TransactionItem, TransactionModal, TransactionsSkeleton } from '@/components/transactions';
import { Icons, ConfirmModal } from '@/components/ui';
import { BottomNavigation, FloatingActionButton } from '@/components/dashboard';
import { useLanguage } from '@/components/providers';

function TransactionsContent() {
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

    const { categories, expenseCategories, incomeCategories } = useCategories();

    // Combine expense and income categories with their subcategories for the filter
    const categoriesWithSubs = [...expenseCategories, ...incomeCategories];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTx, setEditingTx] = useState<Transaction | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
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
        <div className="min-h-[100dvh] bg-[#0a0f0a] flex flex-col">
            {/* Header */}
            <div className="flex items-center px-3 sm:px-4 py-3 sm:py-4 sticky top-0 bg-[#0a0f0a]/95 backdrop-blur z-20 safe-area-top">
                <h1 className="text-lg sm:text-xl font-bold text-white">{t('transactions.title')}</h1>
            </div>

            <TransactionFilterBar
                search={filters.search || ''}
                onSearchChange={handleSearch}
                filters={filters}
                onFilterChange={(key, val) => setFilters(prev => ({ ...prev, [key]: val }))}
                onDateRangeChange={(startDate, endDate) => setFilters(prev => ({
                    ...prev,
                    startDate,
                    endDate,
                    period: prev.period === 'custom' ? 'custom' : prev.period
                }))}
                categories={categoriesWithSubs}
            />

            <div className="flex-1 px-1.5 sm:px-2 pb-28 sm:pb-24 overflow-y-auto">
                {isLoading ? (
                    <TransactionsSkeleton />
                ) : Object.keys(groupedTransactions).length > 0 ? (
                    <div className="space-y-4 sm:space-y-6 pt-3 sm:pt-4">
                        {Object.entries(groupedTransactions).map(([dateLabel, txs]) => (
                            <div key={dateLabel}>
                                <h3 className="px-4 sm:px-6 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest sticky top-0 bg-[#0a0f0a] z-0">
                                    {dateLabel}
                                </h3>
                                <div className="space-y-0.5 sm:space-y-1">
                                    {txs.map(tx => (
                                        <TransactionItem
                                            key={tx.transactionId}
                                            note={tx.note || ''}
                                            categoryName={getCategoryName(tx.categoryId)}
                                            amount={tx.amount}
                                            type={tx.type}
                                            date={tx.date}
                                            onEdit={() => handleEdit(tx)}
                                            onDelete={() => handleDelete(tx.transactionId)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center px-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1a2a1a] flex items-center justify-center mb-3 sm:mb-4">
                            <Icons.Receipt className="w-7 h-7 sm:w-8 sm:h-8 text-gray-600" />
                        </div>
                        <p className="text-white font-medium mb-1 text-sm sm:text-base">{t('transactions.noTransactions')}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">{t('transactions.tryAdjusting')}</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-5 sm:px-6 py-2 bg-[#22c55e] text-[#0a0f0a] font-bold rounded-xl text-sm sm:text-base active:bg-[#16a34a] transition-colors touch-manipulation"
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
                confirmText={t('common.delete')}
                loadingText={t('common.deleting')}
                cancelText={t('common.cancel')}
                isLoading={isDeleting}
                onClose={() => setDeleteId(null)}
                onConfirm={async () => {
                    if (deleteId) {
                        setIsDeleting(true);
                        await deleteTransaction(deleteId);
                        setIsDeleting(false);
                        setDeleteId(null);
                    }
                }}
            />

            <div className="lg:hidden">
                <FloatingActionButton />
                <BottomNavigation />
            </div>
        </div>
    );
}

export default function TransactionsPage() {
    return (
        <Suspense fallback={<TransactionsSkeleton />}>
            <TransactionsContent />
        </Suspense>
    );
}
