import mongoose from "mongoose";
import { EXPENSE_CATEGORIES } from "./Expense.js";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    year: {
      type: Number,
      required: true,
      min: 2020
    },
    limits: [
      {
        category: {
          type: String,
          enum: EXPENSE_CATEGORIES,
          required: true
        },
        amount: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ]
  },
  { timestamps: true }
);

// One budget document per user per month/year
budgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
