import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEMO_TRANSACTIONS } from '../../utils/demoData';
import { TaxCategory } from '../../types/taxTypes';

interface Transaction {
  id: string;
  fromAccountId: string | null;
  toAccountId: string | null;
  amount: number;
  currency: string;
  type: string;
  status: string;
  description: string;
  category?: string;
  icon?: string;
  timestamp: string;
  reference: string;
  // Tax-related fields
  taxCategory?: TaxCategory;
  receiptUrl?: string;
  isVATEligible?: boolean;
  vatAmount?: number;
  taxNotes?: string;
}

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  filter: 'all' | 'sent' | 'received' | 'pending';
}

const initialState: TransactionState = {
  transactions: DEMO_TRANSACTIONS,
  isLoading: false,
  filter: 'all',
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    },
    updateTransaction: (state, action: PayloadAction<{ id: string; updates: Partial<Transaction> }>) => {
      const index = state.transactions.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = { ...state.transactions[index], ...action.payload.updates };
      }
    },
    updateTransactionTaxInfo: (state, action: PayloadAction<{
      id: string;
      taxCategory?: TaxCategory;
      receiptUrl?: string;
      taxNotes?: string;
    }>) => {
      const transaction = state.transactions.find((t) => t.id === action.payload.id);
      if (transaction) {
        transaction.taxCategory = action.payload.taxCategory ?? transaction.taxCategory;
        transaction.receiptUrl = action.payload.receiptUrl ?? transaction.receiptUrl;
        transaction.taxNotes = action.payload.taxNotes ?? transaction.taxNotes;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setFilter: (state, action: PayloadAction<'all' | 'sent' | 'received' | 'pending'>) => {
      state.filter = action.payload;
    },
  },
});

export const {
  setTransactions,
  addTransaction,
  updateTransaction,
  updateTransactionTaxInfo,
  setLoading,
  setFilter,
} = transactionSlice.actions;

export default transactionSlice.reducer;
