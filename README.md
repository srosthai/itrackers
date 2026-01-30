# 💰 Budget Tracker

> Personal Budget Tracker with Google Sheets as Database

A mobile-first personal finance application built with Next.js 16, Auth.js, and Google Sheets API. Track your income and expenses with a beautiful, modern interface.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Auth.js](https://img.shields.io/badge/Auth.js-v5-purple)

---

## ✨ Features

### Core Features
- 📊 **Dashboard** - View total income, expenses, and net profit at a glance
- 💸 **Transactions** - Add, edit, and delete income/expense records
- 🏷️ **Categories** - Organize transactions with custom categories
- 🔐 **Authentication** - Secure login with Google OAuth or email/password

### UI/UX
- 📱 **Mobile-first design** - Optimized for mobile devices
- 🌙 **Dark theme** - Beautiful dark green color scheme
- ⚡ **Fast & responsive** - Optimized performance
- 🎨 **Modern UI** - Glassmorphism and smooth animations

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Authentication** | Auth.js (NextAuth v5) |
| **Database** | Google Sheets API |
| **Styling** | Tailwind CSS |
| **Language** | TypeScript |

---

## 📁 Project Structure

```
budget-tracker/
├── app/
│   ├── (auth)/           # Login & Register pages
│   ├── (dashboard)/      # Main app pages
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   ├── categories/
│   │   └── settings/
│   └── api/              # API routes
├── components/
│   ├── dashboard/        # Dashboard components
│   ├── transactions/     # Transaction components
│   ├── settings/         # Settings components
│   └── ui/               # Shared UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities & configs
└── public/               # Static assets
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Google Cloud account
- Google Sheets API enabled

### Environment Variables

Create a `.env.local` file:

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google Sheets
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
```

### Installation

```bash
# Install dependencies
yarn install

# Run development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📊 Database Schema (Google Sheets)

### Sheets

| Sheet | Description |
|-------|-------------|
| `users` | User accounts & preferences |
| `categories` | Income & expense categories |
| `transactions` | All financial transactions |

---

## 🔒 Security

- Passwords hashed with bcrypt
- All API routes validate user session
- Data isolated by userId
- Secure HTTP-only cookies

---

## 📱 Screenshots

The app features a modern, mobile-first dark theme design with:
- Gradient balance cards
- Smooth animations
- Touch-friendly interactions
- Bottom navigation for mobile

---

## 📝 Documentation

For detailed implementation notes, see:
- [BUILD_PLAN.md](./BUILD_PLAN.md) - Complete build plan & architecture

---

## 📄 License

MIT License - feel free to use for personal projects.

---

*Built with ❤️ using Next.js and Google Sheets*
