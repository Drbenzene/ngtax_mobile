import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import transactionReducer from './slices/transactionSlice';
import walletReducer from './slices/walletSlice';
import taxReducer from './slices/taxSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    transaction: transactionReducer,
    wallet: walletReducer,
    tax: taxReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
