import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEMO_USER } from '../../utils/demoData';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  profilePicture: string | null;
  biometricEnabled: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  hasSeenOnboarding: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    toggleBiometric: (state) => {
      if (state.user) {
        state.user.biometricEnabled = !state.user.biometricEnabled;
      }
    },
    setHasSeenOnboarding: (state, action: PayloadAction<boolean>) => {
      state.hasSeenOnboarding = action.payload;
    },
    // Demo login for UI testing
    demoLogin: (state) => {
      state.user = DEMO_USER;
      state.token = 'demo_token_12345';
      state.isAuthenticated = true;
    },
  },
});

export const {
  login,
  logout,
  updateUser,
  toggleBiometric,
  setHasSeenOnboarding,
  demoLogin,
} = authSlice.actions;

export default authSlice.reducer;
