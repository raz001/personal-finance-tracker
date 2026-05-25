import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { getApiError } from "../../api/axios.js";

// ── Async thunk ───────────────────────────────────────────────────────────────

export const sendChatMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ messages, expenses, month, year }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/finance/chat", {
        messages,
        expenses,
        month,
        year
      });
      return data.reply;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],   // { id, role: "user"|"assistant", content, timestamp }
    loading: false,
    error: null
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
    },
    setChatLoading: (state, action) => {
      state.loading = action.payload;
    },
    setChatError: (state, action) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: action.payload,
          timestamp: new Date().toISOString()
        });
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { addMessage, clearChat, setChatLoading, setChatError } = chatSlice.actions;
export default chatSlice.reducer;
