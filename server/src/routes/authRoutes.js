import express from "express";
import rateLimit from "express-rate-limit";
import { body } from "express-validator";
import { login, register } from "../controllers/authController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

// Strict rate limit on auth endpoints — 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again in 15 minutes" }
});

const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .isLength({ max: 128 })
    .withMessage("Password must be under 128 characters")
];

const loginRules = [
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required")
];

router.post("/register", authLimiter, registerRules, validate, asyncHandler(register));
router.post("/login", authLimiter, loginRules, validate, asyncHandler(login));

export default router;
