// =====================================================
// TEST GOOGLE SHEETS CONNECTION
// 
// GET /api/test-sheets
// Use this to verify your Google Sheets connection is working
// =====================================================

import { NextResponse } from 'next/server';
import { getSheetsClient, getAllRows, SHEETS, initializeSheet } from '@/lib/sheets';

export async function GET() {
    try {
        // Test 1: Can we authenticate?
        await getSheetsClient();

        // Test 2: Can we read from sheets?
        const results: Record<string, number> = {};

        for (const sheetName of Object.values(SHEETS)) {
            try {
                const rows = await getAllRows(sheetName);
                results[sheetName] = rows.length;
            } catch (err) {
                // Sheet might not exist yet
                results[sheetName] = -1; // -1 indicates error
            }
        }

        return NextResponse.json({
            success: true,
            message: '✅ Connected to Google Sheets successfully!',
            spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.slice(0, 10) + '...',
            sheets: results,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Google Sheets connection error:', error);

        return NextResponse.json(
            {
                success: false,
                message: '❌ Failed to connect to Google Sheets',
                error: error instanceof Error ? error.message : String(error),
                hint: 'Check your .env.local file and make sure you\'ve shared the spreadsheet with the service account email.',
            },
            { status: 500 }
        );
    }
}

// POST to initialize all sheets with headers
export async function POST() {
    try {
        for (const sheetName of Object.values(SHEETS)) {
            try {
                await initializeSheet(sheetName);
            } catch (err) {
                console.log(`Sheet ${sheetName} may not exist yet`);
            }
        }

        return NextResponse.json({
            success: true,
            message: '✅ Sheets initialized with headers',
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
