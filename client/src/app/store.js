import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import budgetReducer from "../features/budgets/budgetSlice.js";
import chatReducer from "../features/chat/chatSlice.js";
import expenseReducer from "../features/expenses/expenseSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
    chat: chatReducer,
    budgets: budgetReducer
  }
});
