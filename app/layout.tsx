import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Budget Tracker - Personal Finance Management",
  description: "A simple, beautiful budget tracker that helps you manage your income, expenses, and savings. Track everything in one place.",
  keywords: ["budget", "finance", "tracker", "expenses", "income", "money management"],
  authors: [{ name: "Budget Tracker" }],
  openGraph: {
    title: "Budget Tracker - Personal Finance Management",
    description: "A simple, beautiful budget tracker that helps you manage your income, expenses, and savings.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
