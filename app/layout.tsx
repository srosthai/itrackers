import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider, ThemeProvider, LanguageProvider } from "@/components/providers";
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
  title: {
    default: "I-Tracker | Smart Personal Finance Tracker",
    template: "%s | I-Tracker",
  },
  description: "I-Tracker helps you manage income, expenses, and savings effortlessly. Track your money, visualize spending patterns, and build your financial future with beautiful dashboards.",
  keywords: [
    "finance tracker",
    "budget app",
    "expense tracker",
    "income tracker",
    "money management",
    "personal finance",
    "spending tracker",
    "financial planning",
    "I-Tracker",
  ],
  authors: [{ name: "I-Tracker" }],
  creator: "I-Tracker",
  publisher: "I-Tracker",
  applicationName: "I-Tracker",
  metadataBase: new URL("https://itrackers.vercel.app"),
  openGraph: {
    title: "I-Tracker | Smart Personal Finance Tracker",
    description: "Track your money, visualize spending patterns, and build your financial future. Free personal finance management made simple.",
    type: "website",
    siteName: "I-Tracker",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "I-Tracker | Smart Personal Finance Tracker",
    description: "Track your money, visualize spending patterns, and build your financial future.",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
