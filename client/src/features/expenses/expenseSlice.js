import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { getApiError } from "../../api/axios.js";

export const fetchExpenses = createAsyncThunk(
  "expenses/fetch",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/expenses", { params: { month, year } });
      return data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

export const addExpense = createAsyncThunk(
  "expenses/add",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/expenses", payload);
      return data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

export const updateExpense = createAsyncThunk(
  "expenses/update",
  async ({ id, expense }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/expenses/${id}`, expense);
      return data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "expenses/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/expenses/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    expenses: [],
    loading: false,
    error: null
  },
  reducers: {
    clearExpenseError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchExpenses.fulfilled, (state, action) => {
      state.loading = false;
      state.expenses = action.payload;
    });
    builder.addCase(addExpense.fulfilled, (state, action) => {
      state.loading = false;
      state.expenses.unshift(action.payload);
    });
    builder.addCase(updateExpense.fulfilled, (state, action) => {
      state.loading = false;
      state.expenses = state.expenses.map((expense) =>
        expense._id === action.payload._id ? action.payload : expense
      );
    });
    builder.addCase(deleteExpense.fulfilled, (state, action) => {
      state.loading = false;
      state.expenses = state.expenses.filter((expense) => expense._id !== action.payload);
    });
    builder.addMatcher(
      (action) => action.type.startsWith("expenses/") && action.type.endsWith("/pending"),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action) => action.type.startsWith("expenses/") && action.type.endsWith("/rejected"),
      (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }
    );
  }
});

export const { clearExpenseError } = expenseSlice.actions;
export default expenseSlice.reducer;
