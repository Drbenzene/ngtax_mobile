import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEMO_ACCOUNTS } from '../../utils/demoData';

interface Account {
  id: string;
  userId: string;
  accountType: string;
  currency: string;
  balance: number;
  accountNumber: string;
  status: string;
}

interface WalletState {
  accounts: Account[];
  isLoading: boolean;
  showBalance: boolean;
}

const initialState: WalletState = {
  accounts: DEMO_ACCOUNTS,
  isLoading: false,
  showBalance: true,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
    },
    updateAccountBalance: (
      state,
      action: PayloadAction<{ accountId: string; newBalance: number }>
    ) => {
      const account = state.accounts.find((acc) => acc.id === action.payload.accountId);
      if (account) {
        account.balance = action.payload.newBalance;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    toggleShowBalance: (state) => {
      state.showBalance = !state.showBalance;
    },
  },
});

export const {
  setAccounts,
  updateAccountBalance,
  setLoading,
  toggleShowBalance,
} = walletSlice.actions;

export default walletSlice.reducer;
