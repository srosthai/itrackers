// =====================================================
// AUTH.JS (NextAuth v5) CONFIGURATION
// 
// Features:
// - Google OAuth provider
// - Credentials provider (email/password)
// - Custom Google Sheets adapter for user storage
// =====================================================

import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getRowsWhere, addRow, SHEETS } from './sheets';
import { generateId } from './utils';

// User type for our sheets database
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

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        // Google OAuth Provider
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        // Email/Password Provider
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                const email = credentials.email as string;
                const password = credentials.password as string;

                try {
                    // Find user in Google Sheets
                    const users = await getRowsWhere<SheetUser>(SHEETS.USERS, { email });
                    const user = users[0];

                    if (!user) {
                        throw new Error('No user found with this email');
                    }

                    if (user.authProvider === 'google') {
                        throw new Error('This email is registered with Google. Please use Google Sign In.');
                    }

                    // Verify password
                    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
                    if (!isValidPassword) {
                        throw new Error('Invalid password');
                    }

                    return {
                        id: user.userId,
                        email: user.email,
                        name: user.name,
                        image: user.imageUrl,
                    };
                } catch (error) {
                    console.error('Credentials auth error:', error);
                    throw error;
                }
            },
        }),
    ],

    callbacks: {
        // Handle sign in - create user if doesn't exist (for Google OAuth)
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                try {
                    // Check if user exists
                    const existingUsers = await getRowsWhere<SheetUser>(SHEETS.USERS, {
                        email: user.email!,
                    });

                    if (existingUsers.length === 0) {
                        // Create new user in Google Sheets
                        const newUser: SheetUser = {
                            userId: generateId('usr'),
                            email: user.email!,
                            name: user.name || '',
                            imageUrl: user.image || '',
                            authProvider: 'google',
                            passwordHash: '', // No password for Google users
                            currency: 'USD',
                            timezone: 'Asia/Phnom_Penh',
                            language: 'en',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        };

                        await addRow(SHEETS.USERS, newUser);
                        console.log('Created new Google user:', newUser.userId);
                        user.id = newUser.userId;
                    } else {
                        // User exists, use their ID
                        console.log('Existing user found:', existingUsers[0].userId);
                        user.id = existingUsers[0].userId;
                    }
                } catch (error) {
                    // Log the error but ALLOW login anyway
                    // User can still authenticate, we just couldn't save to sheets
                    console.error('Error saving user to Google Sheets:', error);
                    // Generate a temporary ID if sheets failed
                    user.id = `temp_${Date.now()}`;
                    // Still allow the sign in to proceed
                }
            }
            // Always return true to allow sign in
            return true;
        },

        // Add user ID to JWT
        async jwt({ token, user }) {
            if (user) {
                token.userId = user.id;
            }
            return token;
        },

        // Add user ID to session
        async session({ session, token }) {
            if (token.userId) {
                session.user.id = token.userId as string;
            }
            return session;
        },
    },

    pages: {
        signIn: '/login',
        signUp: '/register',
        error: '/login',
    },

    session: {
        strategy: 'jwt',
    },

    debug: process.env.NODE_ENV === 'development',

    secret: process.env.AUTH_SECRET,
});
