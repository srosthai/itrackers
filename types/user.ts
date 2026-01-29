// =====================================================
// TYPE DEFINITIONS - USER
// =====================================================

export interface User {
    userId: string;
    email: string;
    name?: string;
    imageUrl?: string;
    authProvider: 'credentials' | 'google';
    passwordHash?: string;
    currency: string;
    timezone: string;
    language: 'en' | 'km';
    createdAt: string;
    updatedAt: string;
    [key: string]: unknown; // Index signature for Record<string, unknown> compatibility
}

export interface UserPreferences {
    currency: string;
    timezone: string;
    language: 'en' | 'km';
    monthStartDay: number;
}

export interface Session {
    user: User;
    expires: string;
}
