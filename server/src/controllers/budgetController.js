import Budget from "../models/Budget.js";
import { EXPENSE_CATEGORIES } from "../models/Expense.js";

/** GET /api/budgets?month=5&year=2026 */
export const getBudget = async (req, res) => {
  const month = Number(req.query.month);
  const year = Number(req.query.year);

  if (!month || !year || month < 1 || month > 12 || year < 2020) {
    return res.status(400).json({ message: "Valid month (1-12) and year (>= 2020) are required" });
  }

  const budget = await Budget.findOne({ userId: req.user._id, month, year });

  // Return empty limits instead of 404 — client treats missing budget as "not set"
  if (!budget) {
    return res.json({ limits: [] });
  }

  res.json(budget);
};

/** PUT /api/budgets */
export const upsertBudget = async (req, res) => {
  const { month, year, limits } = req.body;

  // Validate month and year
  const parsedMonth = Number(month);
  const parsedYear = Number(year);

  if (!parsedMonth || parsedMonth < 1 || parsedMonth > 12) {
    return res.status(400).json({ message: "month must be between 1 and 12" });
  }

  if (!parsedYear || parsedYear < 2020) {
    return res.status(400).json({ message: "year must be 2020 or later" });
  }

  if (!Array.isArray(limits)) {
    return res.status(400).json({ message: "limits must be an array" });
  }

  // Validate each limit entry
  for (const item of limits) {
    if (!EXPENSE_CATEGORIES.includes(item.category)) {
      return res.status(400).json({
        message: `Invalid category "${item.category}". Must be one of: ${EXPENSE_CATEGORIES.join(", ")}`
      });
    }
    if (typeof item.amount !== "number" || item.amount < 0) {
      return res.status(400).json({
        message: `Amount for ${item.category} must be a non-negative number`
      });
    }
  }

  const budget = await Budget.findOneAndUpdate(
    { userId: req.user._id, month: parsedMonth, year: parsedYear },
    { $set: { limits } },
    { upsert: true, new: true, runValidators: true }
  );

  res.json(budget);
};

/** DELETE /api/budgets/:month/:year */
export const deleteBudget = async (req, res) => {
  const month = Number(req.params.month);
  const year = Number(req.params.year);

  if (!month || month < 1 || month > 12 || !year || year < 2020) {
    return res.status(400).json({ message: "Valid month and year are required" });
  }

  await Budget.deleteOne({ userId: req.user._id, month, year });

  res.json({ message: "Budget deleted" });
};
