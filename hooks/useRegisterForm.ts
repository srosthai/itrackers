// =====================================================
// USE REGISTER FORM HOOK
// 
// Encapsulates all registration form state and logic
// Separates concerns from UI component
// =====================================================

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface UseRegisterFormReturn {
    // Form state
    formData: RegisterFormData;
    showPassword: boolean;
    showConfirmPassword: boolean;
    error: string;

    // Loading states
    isEmailLoading: boolean;
    isGoogleLoading: boolean;
    isLoading: boolean;

    // Actions
    updateField: (field: keyof RegisterFormData, value: string) => void;
    togglePasswordVisibility: () => void;
    toggleConfirmPasswordVisibility: () => void;
    handleEmailRegister: (e: React.FormEvent) => Promise<void>;
    handleGoogleRegister: () => Promise<void>;
    clearError: () => void;
}

export function useRegisterForm(): UseRegisterFormReturn {
    const router = useRouter();

    // Form state
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    // Loading states
    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const isLoading = isEmailLoading || isGoogleLoading;

    const updateField = useCallback((field: keyof RegisterFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError(''); // Clear error when user types
    }, []);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    const toggleConfirmPasswordVisibility = useCallback(() => {
        setShowConfirmPassword((prev) => !prev);
    }, []);

    const clearError = useCallback(() => {
        setError('');
    }, []);

    const handleEmailRegister = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsEmailLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to create account');
                setIsEmailLoading(false);
                return;
            }

            // Auto-login after successful registration
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                router.push('/login?registered=true');
            } else {
                router.push('/dashboard');
                router.refresh();
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            setIsEmailLoading(false);
        }
    }, [formData, router]);

    const handleGoogleRegister = useCallback(async () => {
        setIsGoogleLoading(true);
        await signIn('google', { callbackUrl: '/dashboard' });
    }, []);

    return {
        // Form state
        formData,
        showPassword,
        showConfirmPassword,
        error,

        // Loading states
        isEmailLoading,
        isGoogleLoading,
        isLoading,

        // Actions
        updateField,
        togglePasswordVisibility,
        toggleConfirmPasswordVisibility,
        handleEmailRegister,
        handleGoogleRegister,
        clearError,
    };
}
