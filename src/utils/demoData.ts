export const DEMO_USER = {
  id: '1',
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  profilePicture: null,
  biometricEnabled: true,
};

export const DEMO_ACCOUNTS = [
  {
    id: '1',
    userId: '1',
    accountType: 'current',
    currency: 'USD',
    balance: 1145.67,
    accountNumber: '****1234',
    status: 'active',
  },
  {
    id: '2',
    userId: '1',
    accountType: 'savings',
    currency: 'USD',
    balance: 1200.00,
    accountNumber: '****5678',
    status: 'active',
  },
];

export const DEMO_TRANSACTIONS = [
  {
    id: '1',
    fromAccountId: '1',
    toAccountId: null,
    amount: -45.20,
    currency: 'USD',
    type: 'bill_payment',
    status: 'completed',
    description: 'Walmart',
    category: 'Groceries',
    icon: '🛒',
    timestamp: new Date().toISOString(),
    reference: 'TXN987654321',
  },
  {
    id: '2',
    fromAccountId: '1',
    toAccountId: '3',
    amount: -50.00,
    currency: 'USD',
    type: 'transfer',
    status: 'completed',
    description: 'Mom (Sarah Johnson)',
    category: 'Transfer',
    icon: '👤',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    reference: 'TXN123456789',
  },
  {
    id: '3',
    fromAccountId: '1',
    toAccountId: null,
    amount: -75.00,
    currency: 'USD',
    type: 'bill_payment',
    status: 'completed',
    description: 'Electric Co',
    category: 'Utilities',
    icon: '⚡',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    reference: 'TXN456789123',
  },
  {
    id: '4',
    fromAccountId: null,
    toAccountId: '1',
    amount: 2500.00,
    currency: 'USD',
    type: 'deposit',
    status: 'completed',
    description: 'Acme Corp',
    category: 'Salary',
    icon: '💼',
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    reference: 'TXN789123456',
  },
  {
    id: '5',
    fromAccountId: '1',
    toAccountId: null,
    amount: -120.50,
    currency: 'USD',
    type: 'bill_payment',
    status: 'completed',
    description: 'Amazon',
    category: 'Shopping',
    icon: '🛍️',
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    reference: 'TXN321654987',
  },
];

export const DEMO_AI_MESSAGES = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! I\'m your AI financial assistant. How can I help you today?',
    timestamp: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: '2',
    role: 'user',
    content: 'Check my balance',
    timestamp: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: '3',
    role: 'assistant',
    content: 'Your current balance is $2,345.67\n\n• Savings Account: $1,200.00\n• Current Account: $1,145.67',
    timestamp: new Date(Date.now() - 295000).toISOString(),
  },
];

export const DEMO_CONTACTS = [
  {
    id: '1',
    name: 'Mom (Sarah Johnson)',
    accountNumber: '****4532',
    avatar: null,
  },
  {
    id: '2',
    name: 'Dad (Michael Johnson)',
    accountNumber: '****8765',
    avatar: null,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    accountNumber: '****3421',
    avatar: null,
  },
];

export const DEMO_CARDS = [
  {
    id: '1',
    type: 'Visa',
    last4: '8290',
    expiryDate: '12/26',
    isDefault: true,
  },
  {
    id: '2',
    type: 'MasterCard',
    last4: '4567',
    expiryDate: '08/25',
    isDefault: false,
  },
];

export default {
  DEMO_USER,
  DEMO_ACCOUNTS,
  DEMO_TRANSACTIONS,
  DEMO_AI_MESSAGES,
  DEMO_CONTACTS,
  DEMO_CARDS,
};
