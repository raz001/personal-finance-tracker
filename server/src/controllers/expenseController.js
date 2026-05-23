import Expense from "../models/Expense.js";

const getExpenseOr404 = async (expenseId, userId) => {
  const expense = await Expense.findOne({ _id: expenseId, userId });
  return expense;
};

export const createExpense = async (req, res) => {
  const { title, amount, category, date, note } = req.body;

  if (!title || amount === undefined || !category || !date) {
    return res.status(400).json({ message: "Title, amount, category and date are required" });
  }

  const expense = await Expense.create({
    userId: req.user._id,
    title,
    amount,
    category,
    date,
    note
  });

  res.status(201).json(expense);
};

export const getExpenses = async (req, res) => {
  const { month, year } = req.query;
  const query = { userId: req.user._id };

  if (month || year) {
    const parsedMonth = Number(month);
    const parsedYear = Number(year);

    if (!parsedMonth || !parsedYear || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).json({ message: "Valid month and year are required together" });
    }

    const startDate = new Date(parsedYear, parsedMonth - 1, 1);
    const endDate = new Date(parsedYear, parsedMonth, 1);
    query.date = { $gte: startDate, $lt: endDate };
  }

  const expenses = await Expense.find(query).sort({ date: -1, createdAt: -1 });
  res.json(expenses);
};

export const updateExpense = async (req, res) => {
  const expense = await getExpenseOr404(req.params.id, req.user._id);

  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }

  const allowedFields = ["title", "amount", "category", "date", "note"];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      expense[field] = req.body[field];
    }
  });

  const updatedExpense = await expense.save();
  res.json(updatedExpense);
};

export const deleteExpense = async (req, res) => {
  const expense = await getExpenseOr404(req.params.id, req.user._id);

  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }

  await expense.deleteOne();
  res.json({ message: "Expense deleted" });
};
