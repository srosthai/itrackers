// =====================================================
// TYPE DEFINITIONS - ACCOUNT
// =====================================================

export type AccountType = 'cash' | 'bank' | 'ewallet' | 'credit';

export interface Account {
    accountId: string;
    userId: string;
    name: string;
    type: AccountType;
    currency: string;
    startingBalance: number;
    currentBalance?: number; // Computed from transactions
    note?: string;
    color?: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: unknown; // Index signature for Record<string, unknown> compatibility
}

export interface AccountFormData {
    name: string;
    type: AccountType;
    currency: string;
    startingBalance: number;
    note?: string;
    color?: string;
}
