// =====================================================
// USE LOGIN FORM HOOK
// 
// Encapsulates all login form state and logic
// Separates concerns from UI component
// =====================================================

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

interface UseLoginFormReturn {
    // Form state
    email: string;
    password: string;
    showPassword: boolean;
    error: string;

    // Loading states
    isEmailLoading: boolean;
    isGoogleLoading: boolean;
    isLoading: boolean;

    // Actions
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    togglePasswordVisibility: () => void;
    handleEmailLogin: (e: React.FormEvent) => Promise<void>;
    handleGoogleLogin: () => Promise<void>;
    clearError: () => void;
}

export function useLoginForm(): UseLoginFormReturn {
    const router = useRouter();

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    // Loading states (separate for each action)
    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const isLoading = isEmailLoading || isGoogleLoading;

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    const clearError = useCallback(() => {
        setError('');
    }, []);

    const handleEmailLogin = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsEmailLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
                setIsEmailLoading(false);
            } else {
                router.push('/dashboard');
                router.refresh();
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            setIsEmailLoading(false);
        }
    }, [email, password, router]);

    const handleGoogleLogin = useCallback(async () => {
        setIsGoogleLoading(true);
        await signIn('google', { callbackUrl: '/dashboard' });
        // Note: This won't execute because signIn redirects
    }, []);

    return {
        // Form state
        email,
        password,
        showPassword,
        error,

        // Loading states
        isEmailLoading,
        isGoogleLoading,
        isLoading,

        // Actions
        setEmail,
        setPassword,
        togglePasswordVisibility,
        handleEmailLogin,
        handleGoogleLogin,
        clearError,
    };
}
