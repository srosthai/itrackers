'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'km';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

// Comprehensive translations
const translations: Record<Language, Record<string, string>> = {
    en: {
        // App
        'app.name': 'I-Tracker',

        // Navigation
        'nav.home': 'Home',
        'nav.insights': 'Insights',
        'nav.categories': 'Categories',
        'nav.profile': 'Profile',

        // Dashboard
        'dashboard.title': 'Dashboard',
        'dashboard.welcome': 'Welcome back,',
        'dashboard.totalBalance': 'Balance',
        'dashboard.income': 'Income',
        'dashboard.expense': 'Expense',
        'dashboard.profit': 'Profit',
        'dashboard.thisMonth': 'This Month',
        'dashboard.spending': 'Spending',
        'dashboard.recentTransactions': 'Recent Transactions',
        'dashboard.seeAll': 'See All',
        'dashboard.noTransactions': 'No transactions yet',
        'dashboard.addFirst': 'Add your first transaction to get started',

        // Transactions
        'transactions.title': 'Insights',
        'transactions.search': 'Search transactions...',
        'transactions.addTransaction': 'Add Transaction',
        'transactions.noTransactions': 'No transactions found',
        'transactions.tryAdjusting': 'Try adjusting filters or add a new one.',
        'transactions.income': 'Income',
        'transactions.expense': 'Expense',
        'transactions.amount': 'Amount',
        'transactions.category': 'Category',
        'transactions.date': 'Date',
        'transactions.note': 'Note',
        'transactions.noteOptional': 'Note (Optional)',
        'transactions.details': 'Details...',
        'transactions.selectCategory': 'Select Category',
        'transactions.newTransaction': 'New Transaction',
        'transactions.editTransaction': 'Edit Transaction',
        'transactions.deleteTransaction': 'Delete Transaction',
        'transactions.deleteConfirm': 'Are you sure you want to delete this transaction? This action cannot be undone.',
        'transactions.saving': 'Saving...',
        'transactions.save': 'Save Transaction',

        // Categories
        'categories.title': 'Categories',
        'categories.search': 'Search categories',
        'categories.expense': 'Expense Categories',
        'categories.income': 'Income Categories',
        'categories.noCategories': 'No categories found',
        'categories.add': 'Add',
        'categories.newCategory': 'New Category',
        'categories.editCategory': 'Edit Category',
        'categories.deleteCategory': 'Delete Category?',
        'categories.deleteConfirm': 'Transactions related to this category might lose their label.',
        'categories.name': 'Name',
        'categories.namePlaceholder': 'e.g. Groceries',
        'categories.parentCategory': 'Parent Category (Optional)',
        'categories.selectParent': 'Select Parent...',
        'categories.parentHint': 'Select a parent to make this a subcategory.',
        'categories.noneTopLevel': 'None (Top Level)',

        // Profile
        'profile.title': 'Profile',
        'profile.appearance': 'Appearance',
        'profile.darkMode': 'Dark',
        'profile.lightMode': 'Light',
        'profile.language': 'Language',
        'profile.english': 'English',
        'profile.khmer': 'ខ្មែរ',
        'profile.general': 'General',
        'profile.categories': 'Categories',
        'profile.categoriesDesc': 'Manage spending categories',
        'profile.account': 'Account',
        'profile.logout': 'Log Out',

        // Common
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.add': 'Add',
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.success': 'Success',
        'common.confirm': 'Confirm',
        'common.uncategorized': 'Uncategorized',

        // Time
        'time.justNow': 'Just now',
        'time.hoursAgo': 'h ago',
        'time.yesterday': 'Yesterday',
        'time.daysAgo': 'days ago',

        // FAB
        'fab.addExpense': 'Add Expense',
        'fab.addIncome': 'Add Income',

        // Chart
        'chart.spendingTrend': 'Spending Trend',
        'chart.monthly': 'Monthly',
        'chart.vsLastMonth': 'vs last month',
        'chart.vsLastWeek': 'vs last week',
        'chart.vsYesterday': 'vs yesterday',
        'chart.vsLastYear': 'vs last year',
        'chart.week1': 'WEEK 1',
        'chart.week2': 'WEEK 2',
        'chart.week3': 'WEEK 3',
        'chart.week4': 'WEEK 4',
        'chart.today': 'Today',
        'chart.week': 'Week',
        'chart.month': 'Month',
        'chart.year': 'Year',
        'chart.mon': 'Mon',
        'chart.tue': 'Tue',
        'chart.wed': 'Wed',
        'chart.thu': 'Thu',
        'chart.fri': 'Fri',
        'chart.sat': 'Sat',
        'chart.sun': 'Sun',
        'chart.jan': 'Jan',
        'chart.feb': 'Feb',
        'chart.mar': 'Mar',
        'chart.apr': 'Apr',
        'chart.may': 'May',
        'chart.jun': 'Jun',
        'chart.jul': 'Jul',
        'chart.aug': 'Aug',
        'chart.sep': 'Sep',
        'chart.oct': 'Oct',
        'chart.nov': 'Nov',
        'chart.dec': 'Dec',
        'chart.noData': 'No spending data',
    },
    km: {
        // App
        'app.name': 'I-Tracker',

        // Navigation
        'nav.home': 'ទំព័រដើម',
        'nav.insights': 'របាយការណ៍',
        'nav.categories': 'ប្រភេទ',
        'nav.profile': 'គណនី',

        // Dashboard
        'dashboard.title': 'ផ្ទាំងគ្រប់គ្រង',
        'dashboard.welcome': 'សូមស្វាគមន៍មកវិញ,',
        'dashboard.totalBalance': 'សមតុល្យ',
        'dashboard.income': 'ចំណូល',
        'dashboard.expense': 'ចំណាយ',
        'dashboard.profit': 'ប្រាក់ចំណេញ',
        'dashboard.thisMonth': 'ខែនេះ',
        'dashboard.spending': 'ការចំណាយ',
        'dashboard.recentTransactions': 'ប្រតិបត្តិការថ្មីៗ',
        'dashboard.seeAll': 'មើលទាំងអស់',
        'dashboard.noTransactions': 'មិនទាន់មានប្រតិបត្តិការ',
        'dashboard.addFirst': 'បន្ថែមប្រតិបត្តិការដំបូងរបស់អ្នក',

        // Transactions
        'transactions.title': 'របាយការណ៍',
        'transactions.search': 'ស្វែងរកប្រតិបត្តិការ...',
        'transactions.addTransaction': 'បន្ថែមប្រតិបត្តិការ',
        'transactions.noTransactions': 'រកមិនឃើញប្រតិបត្តិការ',
        'transactions.tryAdjusting': 'សូមកែសម្រួលតម្រង ឬបន្ថែមថ្មី។',
        'transactions.income': 'ចំណូល',
        'transactions.expense': 'ចំណាយ',
        'transactions.amount': 'ចំនួនទឹកប្រាក់',
        'transactions.category': 'ប្រភេទ',
        'transactions.date': 'កាលបរិច្ឆេទ',
        'transactions.note': 'កំណត់ចំណាំ',
        'transactions.noteOptional': 'កំណត់ចំណាំ (ជាជម្រើស)',
        'transactions.details': 'ព័ត៌មានលម្អិត...',
        'transactions.selectCategory': 'ជ្រើសរើសប្រភេទ',
        'transactions.newTransaction': 'ប្រតិបត្តិការថ្មី',
        'transactions.editTransaction': 'កែប្រតិបត្តិការ',
        'transactions.deleteTransaction': 'លុបប្រតិបត្តិការ',
        'transactions.deleteConfirm': 'តើអ្នកពិតជាចង់លុបប្រតិបត្តិការនេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។',
        'transactions.saving': 'កំពុងរក្សាទុក...',
        'transactions.save': 'រក្សាទុកប្រតិបត្តិការ',

        // Categories
        'categories.title': 'ប្រភេទ',
        'categories.search': 'ស្វែងរកប្រភេទ',
        'categories.expense': 'ប្រភេទចំណាយ',
        'categories.income': 'ប្រភេទចំណូល',
        'categories.noCategories': 'រកមិនឃើញប្រភេទ',
        'categories.add': 'បន្ថែម',
        'categories.newCategory': 'ប្រភេទថ្មី',
        'categories.editCategory': 'កែប្រភេទ',
        'categories.deleteCategory': 'លុបប្រភេទ?',
        'categories.deleteConfirm': 'ប្រតិបត្តិការដែលពាក់ព័ន្ធនឹងប្រភេទនេះអាចនឹងបាត់បង់ស្លាក។',
        'categories.name': 'ឈ្មោះ',
        'categories.namePlaceholder': 'ឧ. គ្រឿងទេស',
        'categories.parentCategory': 'ប្រភេទមេ (ជាជម្រើស)',
        'categories.selectParent': 'ជ្រើសរើសប្រភេទមេ...',
        'categories.parentHint': 'ជ្រើសរើសប្រភេទមេដើម្បីធ្វើឱ្យនេះជាប្រភេទរង។',
        'categories.noneTopLevel': 'គ្មាន (កម្រិតកំពូល)',

        // Profile
        'profile.title': 'គណនី',
        'profile.appearance': 'រូបរាង',
        'profile.darkMode': 'ងងឹត',
        'profile.lightMode': 'ភ្លឺ',
        'profile.language': 'ភាសា',
        'profile.english': 'English',
        'profile.khmer': 'ខ្មែរ',
        'profile.general': 'ទូទៅ',
        'profile.categories': 'ប្រភេទ',
        'profile.categoriesDesc': 'គ្រប់គ្រងប្រភេទចំណាយ',
        'profile.account': 'គណនី',
        'profile.logout': 'ចាកចេញ',

        // Common
        'common.save': 'រក្សាទុក',
        'common.cancel': 'បោះបង់',
        'common.delete': 'លុប',
        'common.edit': 'កែសម្រួល',
        'common.add': 'បន្ថែម',
        'common.loading': 'កំពុងផ្ទុក...',
        'common.error': 'កំហុស',
        'common.success': 'ជោគជ័យ',
        'common.confirm': 'បញ្ជាក់',
        'common.uncategorized': 'គ្មានប្រភេទ',

        // Time
        'time.justNow': 'ឥឡូវនេះ',
        'time.hoursAgo': 'ម៉ោងមុន',
        'time.yesterday': 'ម្សិលមិញ',
        'time.daysAgo': 'ថ្ងៃមុន',

        // FAB
        'fab.addExpense': 'បន្ថែមចំណាយ',
        'fab.addIncome': 'បន្ថែមចំណូល',

        // Chart
        'chart.spendingTrend': 'និន្នាការចំណាយ',
        'chart.monthly': 'ប្រចាំខែ',
        'chart.vsLastMonth': 'បើប្រៀបធៀបខែមុន',
        'chart.vsLastWeek': 'បើប្រៀបធៀបសប្តាហ៍មុន',
        'chart.vsYesterday': 'បើប្រៀបធៀបម្សិលមិញ',
        'chart.vsLastYear': 'បើប្រៀបធៀបឆ្នាំមុន',
        'chart.week1': 'សប្តាហ៍ ១',
        'chart.week2': 'សប្តាហ៍ ២',
        'chart.week3': 'សប្តាហ៍ ៣',
        'chart.week4': 'សប្តាហ៍ ៤',
        'chart.today': 'ថ្ងៃនេះ',
        'chart.week': 'សប្តាហ៍',
        'chart.month': 'ខែ',
        'chart.year': 'ឆ្នាំ',
        'chart.mon': 'ច័ន្ទ',
        'chart.tue': 'អង្គារ',
        'chart.wed': 'ពុធ',
        'chart.thu': 'ព្រហស្បតិ៍',
        'chart.fri': 'សុក្រ',
        'chart.sat': 'សៅរ៍',
        'chart.sun': 'អាទិត្យ',
        'chart.jan': 'មករា',
        'chart.feb': 'កុម្ភៈ',
        'chart.mar': 'មីនា',
        'chart.apr': 'មេសា',
        'chart.may': 'ឧសភា',
        'chart.jun': 'មិថុនា',
        'chart.jul': 'កក្កដា',
        'chart.aug': 'សីហា',
        'chart.sep': 'កញ្ញា',
        'chart.oct': 'តុលា',
        'chart.nov': 'វិច្ឆិកា',
        'chart.dec': 'ធ្នូ',
        'chart.noData': 'គ្មានទិន្នន័យចំណាយ',
    },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Get language from localStorage or browser
        const stored = localStorage.getItem('language') as Language | null;
        if (stored && (stored === 'en' || stored === 'km')) {
            setLanguageState(stored);
        } else {
            // Check browser language
            const browserLang = navigator.language.toLowerCase();
            if (browserLang.startsWith('km')) {
                setLanguageState('km');
            }
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    if (!mounted) {
        return (
            <LanguageContext.Provider value={{ language: 'en', setLanguage, t }}>
                {children}
            </LanguageContext.Provider>
        );
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
