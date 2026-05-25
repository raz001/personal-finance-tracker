import express from "express";
import { analyzeFinance, chatWithFinance } from "../controllers/financeController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/analyze", asyncHandler(analyzeFinance));
router.post("/chat", asyncHandler(chatWithFinance));

export default router;
