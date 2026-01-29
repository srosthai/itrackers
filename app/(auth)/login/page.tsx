'use client';

import Link from 'next/link';
import { useLoginForm } from '@/hooks';
import { Icons } from '@/components/ui';

// =====================================================
// LOGIN PAGE - Clean UI Component
// 
// All state and logic is handled by useLoginForm hook
// This component is purely presentational
// =====================================================

export default function LoginPage() {
    const {
        email,
        password,
        showPassword,
        error,
        isEmailLoading,
        isGoogleLoading,
        isLoading,
        setEmail,
        setPassword,
        togglePasswordVisibility,
        handleEmailLogin,
        handleGoogleLogin,
    } = useLoginForm();

    return (
        <div className="min-h-screen bg-[#0a0f0a] flex flex-col">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="flex-1 flex flex-col px-6 pb-8 max-w-md mx-auto w-full">
                {/* Logo & Welcome */}
                <WelcomeSection />

                {/* Error Message */}
                {error && <ErrorAlert message={error} />}

                {/* Login Form */}
                <form onSubmit={handleEmailLogin} className="flex flex-col gap-5">
                    <EmailInput
                        value={email}
                        onChange={setEmail}
                        disabled={isLoading}
                    />

                    <PasswordInput
                        value={password}
                        onChange={setPassword}
                        showPassword={showPassword}
                        onToggleVisibility={togglePasswordVisibility}
                        disabled={isLoading}
                    />

                    <SubmitButton loading={isEmailLoading} disabled={isLoading}>
                        {isEmailLoading ? 'Signing in...' : 'Login'}
                    </SubmitButton>
                </form>

                {/* Divider */}
                <Divider />

                {/* Google Login */}
                <GoogleButton
                    onClick={handleGoogleLogin}
                    loading={isGoogleLoading}
                    disabled={isLoading}
                />

                {/* Sign Up Link */}
                <p className="text-center text-gray-400 mt-8">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-[#22c55e] hover:text-[#16a34a] font-medium transition-colors">
                        Sign Up
                    </Link>
                </p>

                {/* Security Badge */}
                <SecurityBadge />
            </main>

            {/* Decorative Arrow (Desktop only) */}
            <DecorativeArrow />
        </div>
    );
}

// =====================================================
// SUB-COMPONENTS (Presentational)
// =====================================================

function Header() {
    return (
        <header className="flex items-center h-14 px-4">
            <Link
                href="/"
                className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Go back"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </Link>
            <h1 className="flex-1 text-center text-white font-medium pr-8">Login</h1>
        </header>
    );
}

function WelcomeSection() {
    return (
        <div className="flex flex-col items-center pt-8 pb-10">
            <div className="w-20 h-20 rounded-2xl bg-[#22c55e] flex items-center justify-center mb-6 shadow-lg shadow-[#22c55e]/20">
                <Icons.Wallet className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400 text-center text-sm leading-relaxed">
                Securely track your profits, expenses and growth in one place.
            </p>
        </div>
    );
}

function ErrorAlert({ message }: { message: string }) {
    return (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {message}
        </div>
    );
}

interface EmailInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

function EmailInput({ value, onChange, disabled }: EmailInputProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-white mb-2">
                Email Address
            </label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                </span>
                <input
                    type="email"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full h-14 pl-12 pr-4 bg-[#1a1f1a] text-white placeholder:text-gray-500 rounded-xl border border-[#2a2f2a] focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] focus:outline-none transition-all"
                    required
                    disabled={disabled}
                />
            </div>
        </div>
    );
}

interface PasswordInputProps {
    value: string;
    onChange: (value: string) => void;
    showPassword: boolean;
    onToggleVisibility: () => void;
    disabled?: boolean;
}

function PasswordInput({ value, onChange, showPassword, onToggleVisibility, disabled }: PasswordInputProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-white mb-2">
                Password
            </label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                </span>
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-14 pl-12 pr-12 bg-[#1a1f1a] text-white placeholder:text-gray-500 rounded-xl border border-[#2a2f2a] focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] focus:outline-none transition-all"
                    required
                    disabled={disabled}
                />
                <button
                    type="button"
                    onClick={onToggleVisibility}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                </button>
            </div>
            <div className="flex justify-end mt-2">
                <Link href="/forgot-password" className="text-sm text-[#22c55e] hover:text-[#16a34a] transition-colors">
                    Forgot Password?
                </Link>
            </div>
        </div>
    );
}

interface SubmitButtonProps {
    loading: boolean;
    disabled: boolean;
    children: React.ReactNode;
}

function SubmitButton({ loading, disabled, children }: SubmitButtonProps) {
    return (
        <button
            type="submit"
            disabled={disabled}
            className="w-full h-14 mt-4 bg-[#22c55e] hover:bg-[#16a34a] disabled:bg-[#22c55e]/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#22c55e]/20 hover:shadow-[#22c55e]/30 active:scale-[0.98] flex items-center justify-center gap-2"
        >
            {loading && <LoadingSpinner />}
            {children}
        </button>
    );
}

function LoadingSpinner() {
    return (
        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    );
}

function Divider() {
    return (
        <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-[#2a2f2a]" />
            <span className="text-gray-500 text-sm">Or continue with</span>
            <div className="flex-1 h-px bg-[#2a2f2a]" />
        </div>
    );
}

interface GoogleButtonProps {
    onClick: () => void;
    loading: boolean;
    disabled: boolean;
}

function GoogleButton({ onClick, loading, disabled }: GoogleButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="w-full h-14 bg-[#1a1f1a] hover:bg-[#252a25] disabled:bg-[#1a1f1a]/50 disabled:cursor-not-allowed text-white font-medium rounded-xl border border-[#2a2f2a] transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.98]"
        >
            {loading ? (
                <>
                    <LoadingSpinner />
                    Connecting to Google...
                </>
            ) : (
                <>
                    <GoogleIcon />
                    Continue with Google
                </>
            )}
        </button>
    );
}

function GoogleIcon() {
    return (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}

function SecurityBadge() {
    return (
        <div className="flex items-center justify-center gap-2 mt-auto pt-8">
            <div className="w-2 h-2 rounded-full bg-gray-600" />
            <span className="text-xs text-gray-600 tracking-wider uppercase">
                Bank-Level 256-Bit Encryption
            </span>
        </div>
    );
}

function DecorativeArrow() {
    return (
        <div className="hidden lg:block fixed bottom-0 right-0 pointer-events-none opacity-20">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                <path
                    d="M20 180 L180 20 M180 20 L180 80 M180 20 L120 20"
                    stroke="#22c55e"
                    strokeWidth="8"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
}
