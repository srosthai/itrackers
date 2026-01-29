# Google Sheets Database Setup Guide

This guide explains how to connect your Budget Tracker app to Google Sheets as a database.

---

## 🔧 Step-by-Step Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Name it "Budget Tracker" and click **Create**
4. Wait for the project to be created

---

### Step 2: Enable Google Sheets API

1. In your project, go to **APIs & Services** → **Library**
2. Search for **"Google Sheets API"**
3. Click on it and press **"Enable"**

---

### Step 3: Create a Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"Service Account"**
3. Fill in:
   - **Name**: `budget-tracker-service`
   - **Description**: `Service account for Budget Tracker app`
4. Click **"Create and Continue"**
5. Skip the optional steps, click **"Done"**

---

### Step 4: Download Service Account Key

1. Click on your newly created service account
2. Go to the **"Keys"** tab
3. Click **"Add Key"** → **"Create new key"**
4. Select **"JSON"** format
5. Click **"Create"**
6. Save the downloaded JSON file securely! 🔒

The JSON file contains:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "budget-tracker-service@your-project.iam.gserviceaccount.com",
  ...
}
```

---

### Step 5: Create Your Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a **new spreadsheet**
3. Name it **"Budget Tracker Database"**
4. Create these sheets (tabs at the bottom):
   - `users`
   - `accounts`
   - `categories`
   - `transactions`
   - `recurring_rules`
   - `budgets`

5. Add headers to each sheet:

**users:**
```
userId | email | name | imageUrl | authProvider | passwordHash | currency | timezone | language | createdAt | updatedAt
```

**accounts:**
```
accountId | userId | name | type | currency | startingBalance | note | color | createdAt | updatedAt
```

**categories:**
```
categoryId | userId | name | type | icon | color | parentCategoryId | createdAt | updatedAt
```

**transactions:**
```
transactionId | userId | type | date | amount | currency | accountId | categoryId | fromAccountId | toAccountId | note | tags | receiptUrl | createdAt | updatedAt
```

**recurring_rules:**
```
ruleId | userId | type | amount | categoryId | accountId | frequency | nextRunDate | note | active | createdAt | updatedAt
```

**budgets:**
```
budgetId | userId | month | categoryId | limitAmount | createdAt | updatedAt
```

---

### Step 6: Share Spreadsheet with Service Account

**This is the most important step!**

1. Open your Google Spreadsheet
2. Click **"Share"** button (top right)
3. Paste your service account email:
   ```
   budget-tracker-service@your-project.iam.gserviceaccount.com
   ```
4. Set permission to **"Editor"**
5. Uncheck "Notify people" (it can't receive emails)
6. Click **"Share"**

---

### Step 7: Get Spreadsheet ID

From your spreadsheet URL:
```
https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/edit
                                      ^^^^^^^^^^^^^^^^^^^^^^^^
                                      This is your SPREADSHEET_ID
```

---

### Step 8: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the values:
   ```bash
   # From your JSON key file
   GOOGLE_SHEETS_CLIENT_EMAIL=budget-tracker-service@your-project.iam.gserviceaccount.com
   GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   
   # From your spreadsheet URL
   GOOGLE_SHEETS_SPREADSHEET_ID=1AbCdEfGhIjKlMnOpQrStUvWxYz
   ```

---

## ✅ Test Your Connection

Create a test API route to verify the connection:

```typescript
// app/api/test-sheets/route.ts
import { getAllRows, SHEETS } from '@/lib/sheets';

export async function GET() {
  try {
    const users = await getAllRows(SHEETS.USERS);
    return Response.json({ 
      success: true, 
      message: 'Connected to Google Sheets!',
      userCount: users.length 
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 });
  }
}
```

Then visit: `http://localhost:3000/api/test-sheets`

---

## 🔒 Security Notes

1. **Never commit `.env.local`** - it's in `.gitignore` by default
2. **Keep your JSON key secure** - treat it like a password
3. **Limit spreadsheet sharing** - only share with service account
4. **Use environment variables** in production (Vercel, etc.)

---

## 📊 Spreadsheet Structure

| Sheet | Purpose | Primary Key |
|-------|---------|-------------|
| `users` | User accounts | `userId` |
| `accounts` | Wallets/bank accounts | `accountId` |
| `categories` | Income/expense categories | `categoryId` |
| `transactions` | All financial transactions | `transactionId` |
| `recurring_rules` | Auto-repeat rules | `ruleId` |
| `budgets` | Monthly budget limits | `budgetId` |

---

## 🚀 Ready!

Once configured, you can use the sheets API:

```typescript
import { 
  getAllRows, 
  getRowById, 
  addRow, 
  updateRow, 
  deleteRow,
  SHEETS 
} from '@/lib/sheets';

// Get all transactions for a user
const transactions = await getRowsWhere(SHEETS.TRANSACTIONS, {
  userId: 'usr_12345'
});

// Add a new account
await addRow(SHEETS.ACCOUNTS, {
  accountId: 'acc_' + crypto.randomUUID().slice(0, 8),
  userId: 'usr_12345',
  name: 'Cash',
  type: 'cash',
  currency: 'USD',
  startingBalance: 100,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
```
