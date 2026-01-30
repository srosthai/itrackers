'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/components/providers';

// =====================================================
// HOME PAGE - I-Tracker Landing
//
// Modern, clean landing page with I-Tracker branding
// Mobile-first responsive design
// =====================================================

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="min-h-screen bg-[#0a0f0a] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0f0a]/80 backdrop-blur-lg border-b border-[#1a2f1a] safe-area-top">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image
                src="/i-tracker.png"
                alt="I-Tracker"
                width={180}
                height={50}
                className="h-8 sm:h-12 w-auto"
                priority
              />
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors touch-manipulation"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>

              <Link
                href="/login"
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-300 hover:text-white transition-colors touch-manipulation"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-3 sm:px-4 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-[#0a0f0a] text-xs sm:text-sm font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-[#22c55e]/20 touch-manipulation"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#22c55e]/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#22c55e]/10 rounded-full blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
            <div className="text-center max-w-3xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-full mb-8">
                <span className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
                <span className="text-sm font-medium text-[#22c55e]">Free & Simple Finance Tracking</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Track Your Money,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22c55e] to-[#4ade80]">
                  Build Your Future
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                I-Tracker helps you manage income, expenses, and savings effortlessly.
                Get clear insights into your financial health with beautiful dashboards.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-[#22c55e] hover:bg-[#16a34a] text-[#0a0f0a] font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-[#22c55e]/25 hover:-translate-y-0.5"
                >
                  Start Tracking Free
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-8 py-4 bg-[#1a2a1a] hover:bg-[#243324] text-white font-medium rounded-xl border border-[#2a3f2a] transition-all"
                >
                  Sign In to Dashboard
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-6 mt-10 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckIcon />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon />
                  <span>100% Free</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-[#0f1610]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Everything You Need to Manage Money
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Simple tools that give you complete control over your finances
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="group p-6 bg-[#1a2a1a] border border-[#2a3f2a] rounded-2xl hover:border-[#22c55e]/50 transition-all">
                <div className="w-14 h-14 rounded-xl bg-[#22c55e]/10 flex items-center justify-center mb-5 group-hover:bg-[#22c55e]/20 transition-colors">
                  <IncomeIcon />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Track Income</h3>
                <p className="text-gray-400 leading-relaxed">
                  Record all your earnings with custom categories. See your total income at a glance.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group p-6 bg-[#1a2a1a] border border-[#2a3f2a] rounded-2xl hover:border-[#ef4444]/50 transition-all">
                <div className="w-14 h-14 rounded-xl bg-[#ef4444]/10 flex items-center justify-center mb-5 group-hover:bg-[#ef4444]/20 transition-colors">
                  <ExpenseIcon />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Monitor Expenses</h3>
                <p className="text-gray-400 leading-relaxed">
                  Track where every dollar goes. Categorize spending to identify saving opportunities.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group p-6 bg-[#1a2a1a] border border-[#2a3f2a] rounded-2xl hover:border-[#3b82f6]/50 transition-all">
                <div className="w-14 h-14 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center mb-5 group-hover:bg-[#3b82f6]/20 transition-colors">
                  <ChartIcon />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Visual Insights</h3>
                <p className="text-gray-400 leading-relaxed">
                  Beautiful charts and dashboards that help you understand your financial patterns.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-[#1a2f1a]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-[#22c55e] mb-2">100%</div>
                <div className="text-sm text-gray-400">Free Forever</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">2</div>
                <div className="text-sm text-gray-400">Languages</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-sm text-gray-400">Access Anywhere</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">Secure</div>
                <div className="text-sm text-gray-400">Data Protection</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1a2a1a] to-[#0f1610] border border-[#2a3f2a] rounded-3xl p-8 sm:p-12 text-center">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#22c55e]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#22c55e]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Ready to Take Control?
                </h2>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                  Join I-Tracker today and start your journey to better financial management.
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#22c55e] hover:bg-[#16a34a] text-[#0a0f0a] font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-[#22c55e]/25"
                >
                  Create Free Account
                  <ArrowRightIcon />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0f1610] border-t border-[#1a2f1a] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/i-tracker.png"
                alt="I-Tracker"
                width={140}
                height={40}
                className="h-8 w-auto opacity-70"
              />
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} I-Tracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// =====================================================
// ICONS
// =====================================================

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IncomeIcon() {
  return (
    <svg className="w-7 h-7 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
    </svg>
  );
}

function ExpenseIcon() {
  return (
    <svg className="w-7 h-7 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-7 h-7 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  );
}
