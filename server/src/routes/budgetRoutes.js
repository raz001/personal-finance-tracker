import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  deleteBudget,
  getBudget,
  upsertBudget
} from "../controllers/budgetController.js";

const router = express.Router();

router.use(protect);

router.get("/", asyncHandler(getBudget));
router.put("/", asyncHandler(upsertBudget));
router.delete("/:month/:year", asyncHandler(deleteBudget));

export default router;
