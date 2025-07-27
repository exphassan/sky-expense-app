/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
} as const;

export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        PROFILE: '/auth/profile',
        REFRESH: '/auth/refresh',
    },

    // Investments
    INVESTMENTS: {
        BASE: '/investments',
        BY_ID: (id: string) => `/investments/${id}`,
        PORTFOLIO_SUMMARY: '/investments/portfolio-summary',
        UPDATE_VALUE: (id: string) => `/investments/${id}/current-value`,
    },

    // Debts
    DEBTS: {
        BASE: '/debts',
        BY_ID: (id: string) => `/debts/${id}`,
        MARK_PAID: (id: string) => `/debts/${id}/mark-paid`,
        OVERDUE: '/debts/overdue',
    },

    // Expenses
    EXPENSES: {
        BASE: '/expenses',
        BY_ID: (id: string) => `/expenses/${id}`,
        SUMMARY: '/expenses/summary',
    },

    // Income
    INCOMES: {
        BASE: '/incomes',
        BY_ID: (id: string) => `/incomes/${id}`,
    },

    // Subscriptions
    SUBSCRIPTIONS: {
        BASE: '/subscriptions',
        BY_ID: (id: string) => `/subscriptions/${id}`,
        UPCOMING_REMINDERS: '/subscriptions/upcoming-reminders',
        DUE_TODAY: '/subscriptions/due-today',
    },
} as const;