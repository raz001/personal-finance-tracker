import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Expense from "../models/Expense.js";

/** GET /api/user/profile */
export const getProfile = async (req, res) => {
  // req.user is already attached by the protect middleware (password excluded)
  const expenseCount = await Expense.countDocuments({ userId: req.user._id });

  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    createdAt: req.user.createdAt,
    expenseCount
  });
};

/** PUT /api/user/profile — update name and/or email */
export const updateProfile = async (req, res) => {
  const { name, email } = req.body;

  if (!name && !email) {
    return res.status(400).json({ message: "Provide name or email to update" });
  }

  // If changing email, make sure it isn't taken by another account
  if (email && email !== req.user.email) {
    const taken = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (taken) {
      return res.status(409).json({ message: "Email is already in use" });
    }
  }

  if (name) req.user.name = name.trim();
  if (email) req.user.email = email.trim().toLowerCase();

  const updated = await req.user.save();

  res.json({
    id: updated._id,
    name: updated.name,
    email: updated.email
  });
};

/** PUT /api/user/password — change password */
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current and new password are required" });
  }

  if (newPassword.length < 6) {
    return res.status(422).json({ message: "New password must be at least 6 characters" });
  }

  if (newPassword.length > 128) {
    return res.status(422).json({ message: "New password must be under 128 characters" });
  }

  // Fetch the full user record so we have the password hash
  const user = await User.findById(req.user._id);
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  res.json({ message: "Password updated successfully" });
};

/** DELETE /api/user/account — permanently delete account and all expenses */
export const deleteAccount = async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required to delete your account" });
  }

  const user = await User.findById(req.user._id);
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Password is incorrect" });
  }

  // Delete all expenses first, then the user
  await Expense.deleteMany({ userId: req.user._id });
  await user.deleteOne();

  res.json({ message: "Account deleted" });
};
