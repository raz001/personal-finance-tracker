import express from "express";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense
} from "../controllers/expenseController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(asyncHandler(createExpense)).get(asyncHandler(getExpenses));
router.route("/:id").put(asyncHandler(updateExpense)).delete(asyncHandler(deleteExpense));

export default router;
