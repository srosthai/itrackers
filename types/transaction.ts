// =====================================================
// TYPE DEFINITIONS - TRANSACTION
// =====================================================

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
    transactionId: string;
    userId: string;
    type: TransactionType;
    date: string; // ISO date format
    amount: number;
    currency: string;
    accountId?: string; // For income/expense
    categoryId?: string; // Null for transfers
    fromAccountId?: string; // For transfers
    toAccountId?: string; // For transfers
    note?: string;
    tags?: string[]; // Parsed from comma-separated
    receiptUrl?: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: unknown; // Index signature for Record<string, unknown> compatibility
}

export interface TransactionFormData {
    type: TransactionType;
    date: string;
    amount: number;
    currency: string;
    accountId?: string;
    categoryId?: string;
    fromAccountId?: string;
    toAccountId?: string;
    note?: string;
    tags?: string[];
}

export interface TransactionFilters {
    startDate?: string;
    endDate?: string;
    type?: TransactionType;
    categoryId?: string;
    accountId?: string;
    search?: string;
    sortBy?: 'date' | 'amount';
    sortOrder?: 'asc' | 'desc';
}
