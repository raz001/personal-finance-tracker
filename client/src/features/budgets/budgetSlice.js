import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { getApiError } from "../../api/axios.js";

// ── Async thunks ──────────────────────────────────────────────────────────────

export const fetchBudget = createAsyncThunk(
  "budgets/fetch",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/budgets", { params: { month, year } });
      return data; // { limits: [{ category, amount }] } or full Budget doc
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

export const saveBudget = createAsyncThunk(
  "budgets/save",
  async ({ month, year, limits }, { rejectWithValue }) => {
    try {
      // Convert keyed object { Food: 5000, Transport: 2000 } to array format
      const limitsArray = Object.entries(limits)
        .filter(([, amount]) => amount !== "" && Number(amount) >= 0)
        .map(([category, amount]) => ({ category, amount: Number(amount) }));

      const { data } = await api.put("/api/budgets", {
        month,
        year,
        limits: limitsArray
      });
      return data; // saved Budget doc
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Convert limits array from API to keyed object for easy lookup */
const limitsArrayToObject = (limitsArray) =>
  (limitsArray || []).reduce((acc, { category, amount }) => {
    acc[category] = amount;
    return acc;
  }, {});

// ── Slice ─────────────────────────────────────────────────────────────────────

const budgetSlice = createSlice({
  name: "budgets",
  initialState: {
    limits: {},     // { Food: 5000, Transport: 2000, ... }
    loading: false,
    saving: false,
    error: null
  },
  reducers: {
    setLimit: (state, action) => {
      const { category, amount } = action.payload;
      state.limits[category] = amount;
    },
    clearLimits: (state) => {
      state.limits = {};
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchBudget
      .addCase(fetchBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.limits = limitsArrayToObject(action.payload.limits);
      })
      .addCase(fetchBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // saveBudget
      .addCase(saveBudget.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveBudget.fulfilled, (state, action) => {
        state.saving = false;
        state.limits = limitsArrayToObject(action.payload.limits);
      })
      .addCase(saveBudget.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  }
});

export const { setLimit, clearLimits } = budgetSlice.actions;
export default budgetSlice.reducer;
