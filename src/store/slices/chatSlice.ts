import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEMO_AI_MESSAGES } from '../../utils/demoData';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  functionCall?: any;
}

interface ChatState {
  messages: Message[];
  activeSessionId: string | null;
  isLoading: boolean;
  isTyping: boolean;
}

const initialState: ChatState = {
  messages: DEMO_AI_MESSAGES,
  activeSessionId: '1',
  isLoading: false,
  isTyping: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    createSession: (state, action: PayloadAction<string>) => {
      state.activeSessionId = action.payload;
      state.messages = [];
    },
  },
});

export const {
  addMessage,
  setMessages,
  clearMessages,
  setLoading,
  setTyping,
  createSession,
} = chatSlice.actions;

export default chatSlice.reducer;
