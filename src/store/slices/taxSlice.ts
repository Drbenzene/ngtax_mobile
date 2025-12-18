// Tax State Management - Redux Slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TaxFiling,
  MonthlyTaxSummary,
  TaxReceipt,
  TaxReminder,
  TaxPreferences,
  BusinessTaxInfo,
  TaxPeriodInfo,
  TaxComplianceScore,
  FilingStatus,
} from '../../types/taxTypes';
import { getTaxPeriod } from '../../utils/taxCalculations';

interface TaxState {
  businessInfo: BusinessTaxInfo | null;
  currentPeriod: TaxPeriodInfo;
  filings: TaxFiling[];
  receipts: TaxReceipt[];
  reminders: TaxReminder[];
  preferences: TaxPreferences;
  complianceScore: TaxComplianceScore | null;
  loading: boolean;
}

const initialState: TaxState = {
  businessInfo: null,
  currentPeriod: getTaxPeriod(new Date()),
  filings: [],
  receipts: [],
  reminders: [],
  preferences: {
    enableReminders: true,
    reminderDaysBefore: 5,
    autoCalculateVAT: true,
    defaultTaxCategory: 'non_taxable',
    emailReports: false,
  },
  complianceScore: null,
  loading: false,
};

const taxSlice = createSlice({
  name: 'tax',
  initialState,
  reducers: {
    // Business Info
    setBusinessInfo: (state, action: PayloadAction<BusinessTaxInfo>) => {
      state.businessInfo = action.payload;
    },

    updateBusinessInfo: (state, action: PayloadAction<Partial<BusinessTaxInfo>>) => {
      if (state.businessInfo) {
        state.businessInfo = { ...state.businessInfo, ...action.payload };
      }
    },

    // Tax Period
    setCurrentPeriod: (state, action: PayloadAction<TaxPeriodInfo>) => {
      state.currentPeriod = action.payload;
    },

    // Filings
    addFiling: (state, action: PayloadAction<TaxFiling>) => {
      state.filings.unshift(action.payload);
    },

    updateFiling: (state, action: PayloadAction<{ id: string; updates: Partial<TaxFiling> }>) => {
      const index = state.filings.findIndex((f) => f.id === action.payload.id);
      if (index !== -1) {
        state.filings[index] = { ...state.filings[index], ...action.payload.updates };
      }
    },

    deleteFiling: (state, action: PayloadAction<string>) => {
      state.filings = state.filings.filter((f) => f.id !== action.payload);
    },

    updateFilingStatus: (state, action: PayloadAction<{ id: string; status: FilingStatus }>) => {
      const filing = state.filings.find((f) => f.id === action.payload.id);
      if (filing) {
        filing.status = action.payload.status;
        filing.updatedAt = new Date().toISOString();
      }
    },

    // Receipts
    addReceipt: (state, action: PayloadAction<TaxReceipt>) => {
      state.receipts.unshift(action.payload);
    },

    updateReceipt: (state, action: PayloadAction<{ id: string; updates: Partial<TaxReceipt> }>) => {
      const index = state.receipts.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.receipts[index] = { ...state.receipts[index], ...action.payload.updates };
      }
    },

    deleteReceipt: (state, action: PayloadAction<string>) => {
      state.receipts = state.receipts.filter((r) => r.id !== action.payload);
    },

    linkReceiptToTransaction: (state, action: PayloadAction<{ receiptId: string; transactionId: string }>) => {
      const receipt = state.receipts.find((r) => r.id === action.payload.receiptId);
      if (receipt) {
        receipt.transactionId = action.payload.transactionId;
      }
    },

    // Reminders
    addReminder: (state, action: PayloadAction<TaxReminder>) => {
      state.reminders.unshift(action.payload);
    },

    markReminderRead: (state, action: PayloadAction<string>) => {
      const reminder = state.reminders.find((r) => r.id === action.payload);
      if (reminder) {
        reminder.isRead = true;
      }
    },

    deleteReminder: (state, action: PayloadAction<string>) => {
      state.reminders = state.reminders.filter((r) => r.id !== action.payload);
    },

    clearReadReminders: (state) => {
      state.reminders = state.reminders.filter((r) => !r.isRead);
    },

    // Preferences
    updatePreferences: (state, action: PayloadAction<Partial<TaxPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },

    // Compliance Score
    setComplianceScore: (state, action: PayloadAction<TaxComplianceScore>) => {
      state.complianceScore = action.payload;
    },

    // Loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Reset
    resetTaxState: () => initialState,
  },
});

export const {
  setBusinessInfo,
  updateBusinessInfo,
  setCurrentPeriod,
  addFiling,
  updateFiling,
  deleteFiling,
  updateFilingStatus,
  addReceipt,
  updateReceipt,
  deleteReceipt,
  linkReceiptToTransaction,
  addReminder,
  markReminderRead,
  deleteReminder,
  clearReadReminders,
  updatePreferences,
  setComplianceScore,
  setLoading,
  resetTaxState,
} = taxSlice.actions;

export default taxSlice.reducer;
