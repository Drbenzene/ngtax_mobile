// API Configuration (Demo - No real backend)
export const API_CONFIG = {
  BASE_URL: 'https://api.demo.com', // Demo URL
  TIMEOUT: 10000,
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'NGTax AI',
  VERSION: '1.0.0',
  CURRENCY: 'USD',
  CURRENCY_SYMBOL: '$',
};

// Transaction Limits
export const TRANSACTION_LIMITS = {
  MIN_AMOUNT: 1,
  MAX_AMOUNT: 10000,
  DAILY_LIMIT: 5000,
  PIN_REQUIRED_THRESHOLD: 10,
};

// Permission Types
export const PERMISSIONS = {
  CAMERA: 'camera',
  MICROPHONE: 'microphone',
  MEDIA_LIBRARY: 'mediaLibrary',
  NOTIFICATIONS: 'notifications',
} as const;

// Transaction Types
export const TRANSACTION_TYPES = {
  TRANSFER: 'transfer',
  BILL_PAYMENT: 'bill_payment',
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
} as const;

// Transaction Status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

// Account Types
export const ACCOUNT_TYPES = {
  SAVINGS: 'savings',
  CURRENT: 'current',
} as const;

// AI Message Roles
export const AI_MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
} as const;

// Filter Types
export const FILTER_TYPES = {
  ALL: 'all',
  SENT: 'sent',
  RECEIVED: 'received',
  PENDING: 'pending',
} as const;

export default {
  API_CONFIG,
  APP_CONFIG,
  TRANSACTION_LIMITS,
  PERMISSIONS,
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
  ACCOUNT_TYPES,
  AI_MESSAGE_ROLES,
  FILTER_TYPES,
};
