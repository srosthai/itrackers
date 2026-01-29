// =====================================================
// USER REGISTRATION API
// 
// POST /api/auth/register
// Creates a new user with email/password in Google Sheets
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getRowsWhere, addRow, SHEETS } from '@/lib/sheets';
import { generateId } from '@/lib/utils';

interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

interface SheetUser {
    userId: string;
    email: string;
    name: string;
    imageUrl: string;
    authProvider: 'google' | 'credentials';
    passwordHash: string;
    currency: string;
    timezone: string;
    language: string;
    createdAt: string;
    updatedAt: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: RegisterRequest = await request.json();
        const { name, email, password } = body;

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUsers = await getRowsWhere<SheetUser>(SHEETS.USERS, { email });

        if (existingUsers.length > 0) {
            const existingUser = existingUsers[0];
            if (existingUser.authProvider === 'google') {
                return NextResponse.json(
                    { error: 'This email is registered with Google. Please use Google Sign In.' },
                    { status: 409 }
                );
            }
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create new user
        const newUser: SheetUser = {
            userId: generateId('usr'),
            email: email.toLowerCase().trim(),
            name: name.trim(),
            imageUrl: '',
            authProvider: 'credentials',
            passwordHash,
            currency: 'USD',
            timezone: 'Asia/Phnom_Penh',
            language: 'en',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await addRow(SHEETS.USERS, newUser);

        // Return success (without sensitive data)
        return NextResponse.json(
            {
                success: true,
                message: 'Account created successfully',
                user: {
                    id: newUser.userId,
                    email: newUser.email,
                    name: newUser.name,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Failed to create account. Please try again.' },
            { status: 500 }
        );
    }
}
