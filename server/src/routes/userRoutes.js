import express from "express";
import { body } from "express-validator";
import asyncHandler from "../middleware/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import {
  changePassword,
  deleteAccount,
  getProfile,
  updateProfile
} from "../controllers/userController.js";

const router = express.Router();

// All user routes require authentication
router.use(protect);

const profileRules = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be blank").isLength({ max: 100 }),
  body("email").optional().trim().isEmail().withMessage("Valid email is required").normalizeEmail()
];
 
const passwordRules = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 }).withMessage("New password must be at least 6 characters")
    .isLength({ max: 128 }).withMessage("New password must be under 128 characters")
];

router.get("/profile", asyncHandler(getProfile));
router.put("/profile", profileRules, validate, asyncHandler(updateProfile));
router.put("/password", passwordRules, validate, asyncHandler(changePassword));
router.delete("/account", asyncHandler(deleteAccount));

export default router;
