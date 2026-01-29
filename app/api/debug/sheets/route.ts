// =====================================================
// DEBUG: TEST GOOGLE SHEETS CONNECTION
// 
// GET /api/debug/sheets - Test read from sheets
// POST /api/debug/sheets - Test write to sheets
// =====================================================

import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
    try {
        // 1. Check environment variables
        const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
        const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

        const envCheck = {
            hasPrivateKey: !!privateKey,
            privateKeyLength: privateKey?.length || 0,
            hasClientEmail: !!clientEmail,
            clientEmail: clientEmail?.slice(0, 20) + '...',
            hasSpreadsheetId: !!spreadsheetId,
            spreadsheetId: spreadsheetId?.slice(0, 10) + '...',
        };

        if (!privateKey || !clientEmail || !spreadsheetId) {
            return NextResponse.json({
                success: false,
                error: 'Missing environment variables',
                envCheck,
            }, { status: 400 });
        }

        // 2. Try to authenticate
        const auth = new google.auth.JWT({
            email: clientEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // 3. Try to read from users sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'users!A:K',
        });

        return NextResponse.json({
            success: true,
            message: '✅ Google Sheets connection successful!',
            envCheck,
            sheetsData: {
                headers: response.data.values?.[0] || [],
                rowCount: (response.data.values?.length || 1) - 1,
                sampleData: response.data.values?.slice(0, 3),
            },
        });
    } catch (error: unknown) {
        const err = error as Error & { code?: number; errors?: unknown[] };
        console.error('Google Sheets debug error:', err);
        return NextResponse.json({
            success: false,
            error: err.message,
            errorCode: err.code,
            errorDetails: err.errors,
        }, { status: 500 });
    }
}

export async function POST() {
    try {
        const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
        const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

        if (!privateKey || !clientEmail || !spreadsheetId) {
            return NextResponse.json({ success: false, error: 'Missing env vars' }, { status: 400 });
        }

        const auth = new google.auth.JWT({
            email: clientEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Try to write a test row
        const testData = [
            `test_${Date.now()}`,  // userId
            'test@example.com',     // email
            'Test User',            // name
            '',                     // imageUrl
            'credentials',          // authProvider
            '',                     // passwordHash
            'USD',                  // currency
            'Asia/Phnom_Penh',      // timezone
            'en',                   // language
            new Date().toISOString(), // createdAt
            new Date().toISOString(), // updatedAt
        ];

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'users!A:K',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [testData],
            },
        });

        return NextResponse.json({
            success: true,
            message: '✅ Test row written successfully!',
            result: response.data,
        });
    } catch (error: unknown) {
        const err = error as Error & { code?: number; errors?: unknown[] };
        console.error('Google Sheets write error:', err);
        return NextResponse.json({
            success: false,
            error: err.message,
            errorCode: err.code,
            errorDetails: err.errors,
        }, { status: 500 });
    }
}
