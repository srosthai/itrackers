'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

// =====================================================
// AUTH SESSION PROVIDER
// 
// Wraps the app with NextAuth SessionProvider
// for client-side session access
// =====================================================

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    return <SessionProvider>{children}</SessionProvider>;
}
