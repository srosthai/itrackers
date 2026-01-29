// =====================================================
// GOOGLE SHEETS DATABASE LAYER
// 
// This module provides CRUD operations for Google Sheets
// acting as a database for the Budget Tracker app.
// =====================================================

import { google, sheets_v4 } from 'googleapis';

// Sheet names matching BUILD_PLAN.md
export const SHEETS = {
    USERS: 'users',
    ACCOUNTS: 'accounts',
    CATEGORIES: 'categories',
    TRANSACTIONS: 'transactions',
    RECURRING_RULES: 'recurring_rules',
    BUDGETS: 'budgets',
} as const;

export type SheetName = (typeof SHEETS)[keyof typeof SHEETS];

// Column definitions for each sheet
export const SHEET_COLUMNS = {
    users: [
        'userId', 'email', 'name', 'imageUrl', 'authProvider',
        'passwordHash', 'currency', 'timezone', 'language',
        'createdAt', 'updatedAt'
    ],
    accounts: [
        'accountId', 'userId', 'name', 'type', 'currency',
        'startingBalance', 'note', 'color', 'createdAt', 'updatedAt'
    ],
    categories: [
        'categoryId', 'userId', 'name', 'type',
        'parentCategoryId', 'createdAt', 'updatedAt'
    ],
    transactions: [
        'transactionId', 'userId', 'type', 'date', 'amount',
        'currency', 'accountId', 'categoryId', 'fromAccountId',
        'toAccountId', 'note', 'tags', 'receiptUrl',
        'createdAt', 'updatedAt'
    ],
    recurring_rules: [
        'ruleId', 'userId', 'type', 'amount', 'categoryId',
        'accountId', 'frequency', 'nextRunDate', 'note',
        'active', 'createdAt', 'updatedAt'
    ],
    budgets: [
        'budgetId', 'userId', 'month', 'categoryId',
        'limitAmount', 'createdAt', 'updatedAt'
    ],
} as const;

// =====================================================
// GOOGLE SHEETS CLIENT
// =====================================================

let sheetsClient: sheets_v4.Sheets | null = null;

/**
 * Get authenticated Google Sheets client
 */
export async function getSheetsClient(): Promise<sheets_v4.Sheets> {
    if (sheetsClient) return sheetsClient;

    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;

    if (!privateKey || !clientEmail) {
        throw new Error('Google Sheets credentials not configured. Check GOOGLE_SHEETS_PRIVATE_KEY and GOOGLE_SHEETS_CLIENT_EMAIL env vars.');
    }

    const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    sheetsClient = google.sheets({ version: 'v4', auth });
    return sheetsClient;
}

/**
 * Get spreadsheet ID from environment
 */
function getSpreadsheetId(): string {
    const id = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    if (!id) {
        throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID not configured');
    }
    return id;
}

// =====================================================
// CRUD OPERATIONS
// =====================================================

/**
 * Get all rows from a sheet
 */
export async function getAllRows<T extends Record<string, unknown>>(
    sheetName: SheetName
): Promise<T[]> {
    const sheets = await getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:Z`,
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return []; // No data or only header

    const headers = rows[0] as string[];
    const dataRows = rows.slice(1);

    return dataRows.map((row) => {
        const obj: Record<string, unknown> = {};
        headers.forEach((header, index) => {
            obj[header] = row[index] ?? null;
        });
        return obj as T;
    });
}

/**
 * Get rows filtered by a condition
 */
export async function getRowsWhere<T extends Record<string, unknown>>(
    sheetName: SheetName,
    filter: Partial<T>
): Promise<T[]> {
    const allRows = await getAllRows<T>(sheetName);

    return allRows.filter((row) => {
        return Object.entries(filter).every(([key, value]) => {
            return row[key] === value;
        });
    });
}

/**
 * Get a single row by ID
 */
export async function getRowById<T extends Record<string, unknown>>(
    sheetName: SheetName,
    idColumn: string,
    id: string
): Promise<T | null> {
    const rows = await getRowsWhere<T>(sheetName, { [idColumn]: id } as Partial<T>);
    return rows[0] || null;
}

/**
 * Add a new row to a sheet
 */
export async function addRow<T extends Record<string, unknown>>(
    sheetName: SheetName,
    data: T
): Promise<T> {
    const sheets = await getSheetsClient();
    const spreadsheetId = getSpreadsheetId();
    const columns = SHEET_COLUMNS[sheetName];

    // Build row values in column order
    const values = columns.map((col) => {
        const value = data[col];
        if (value === null || value === undefined) return '';
        if (Array.isArray(value)) return value.join(',');
        return String(value);
    });

    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
            values: [values],
        },
    });

    return data;
}

/**
 * Update a row by finding it and replacing values
 */
export async function updateRow<T extends Record<string, unknown>>(
    sheetName: SheetName,
    idColumn: string,
    id: string,
    updates: Partial<T>
): Promise<T | null> {
    const sheets = await getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    // Get all rows to find the row index
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:Z`,
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return null;

    const headers = rows[0] as string[];
    const idColumnIndex = headers.indexOf(idColumn);

    if (idColumnIndex === -1) {
        throw new Error(`Column ${idColumn} not found in sheet ${sheetName}`);
    }

    // Find the row index (1-based, +1 for header)
    let rowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
        if (rows[i][idColumnIndex] === id) {
            rowIndex = i + 1; // Sheets are 1-indexed
            break;
        }
    }

    if (rowIndex === -1) return null;

    // Get current row data
    const currentRow = rows[rowIndex - 1];
    const currentData: Record<string, unknown> = {};
    headers.forEach((header, index) => {
        currentData[header] = currentRow[index] ?? null;
    });

    // Merge with updates
    const updatedData = { ...currentData, ...updates, updatedAt: new Date().toISOString() };
    const columns = SHEET_COLUMNS[sheetName];

    const values = columns.map((col) => {
        const value = updatedData[col];
        if (value === null || value === undefined) return '';
        if (Array.isArray(value)) return value.join(',');
        return String(value);
    });

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A${rowIndex}:Z${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [values],
        },
    });

    return updatedData as T;
}

/**
 * Delete a row by ID
 */
export async function deleteRow(
    sheetName: SheetName,
    idColumn: string,
    id: string
): Promise<boolean> {
    const sheets = await getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    // Get spreadsheet info to find sheet ID
    const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId,
    });

    const sheet = spreadsheet.data.sheets?.find(
        (s) => s.properties?.title === sheetName
    );

    if (!sheet?.properties?.sheetId) {
        throw new Error(`Sheet ${sheetName} not found`);
    }

    // Get all rows to find the row index
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:Z`,
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return false;

    const headers = rows[0] as string[];
    const idColumnIndex = headers.indexOf(idColumn);

    if (idColumnIndex === -1) {
        throw new Error(`Column ${idColumn} not found in sheet ${sheetName}`);
    }

    // Find the row index (0-based for delete)
    let rowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
        if (rows[i][idColumnIndex] === id) {
            rowIndex = i; // 0-indexed for batchUpdate
            break;
        }
    }

    if (rowIndex === -1) return false;

    // Delete the row
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [
                {
                    deleteDimension: {
                        range: {
                            sheetId: sheet.properties.sheetId,
                            dimension: 'ROWS',
                            startIndex: rowIndex,
                            endIndex: rowIndex + 1,
                        },
                    },
                },
            ],
        },
    });

    return true;
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Initialize sheet with headers if empty
 */
export async function initializeSheet(sheetName: SheetName): Promise<void> {
    const sheets = await getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    // Check if sheet has headers
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!1:1`,
    });

    if (!response.data.values || response.data.values.length === 0) {
        // Add headers
        const columns = SHEET_COLUMNS[sheetName];
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A1`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [columns],
            },
        });
    }
}

/**
 * Check if a value exists in a column (for uniqueness)
 */
export async function valueExists(
    sheetName: SheetName,
    column: string,
    value: string
): Promise<boolean> {
    const rows = await getRowsWhere(sheetName, { [column]: value });
    return rows.length > 0;
}

/**
 * Count rows matching a filter
 */
export async function countRows<T extends Record<string, unknown>>(
    sheetName: SheetName,
    filter?: Partial<T>
): Promise<number> {
    if (!filter) {
        const rows = await getAllRows(sheetName);
        return rows.length;
    }
    const rows = await getRowsWhere<T>(sheetName, filter);
    return rows.length;
}

/**
 * Force update headers for a sheet (Fix mismatch columns)
 */
export async function updateSheetHeaders(sheetName: SheetName): Promise<void> {
    const sheets = await getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!spreadsheetId) return;

    const columns = SHEET_COLUMNS[sheetName];
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [columns],
        },
    });
}
