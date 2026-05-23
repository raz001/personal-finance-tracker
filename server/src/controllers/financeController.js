import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
].filter(Boolean);

const buildFallbackInsight = (items) => {
  const sorted = [...items].sort((a, b) => Number(b.amount) - Number(a.amount));
  const top = sorted.slice(0, 2).map((item) => item.category).join(" and ") || "discretionary spending";
  const total = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return `You spent ₹${total.toFixed(0)} across tracked categories. Your biggest areas are ${top}. Review recurring purchases there, set a weekly cap, and move a fixed amount to savings right after payday.`;
};

export const analyzeFinance = async (req, res) => {
  const expenses = req.body;

  if (!Array.isArray(expenses)) {
    return res.status(400).json({ message: "Request body must be an array" });
  }

  if (!expenses.length) {
    return res.status(400).json({ message: "At least one category amount is required" });
  }

  const sanitized = expenses.map(({ category, amount }) => ({
    category,
    amount: Number(amount)
  }));

  if (sanitized.some((item) => !item.category || Number.isNaN(item.amount))) {
    return res.status(400).json({ message: "Each item must include category and numeric amount" });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY?.trim();

  if (!geminiApiKey) {
    const fallbackInsight = buildFallbackInsight(sanitized);
    return res.json({
      insight: fallbackInsight,
      source: "fallback",
      message: "AI analysis not configured. Showing local insight."
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const prompt = [
      "You are a personal finance assistant for an Indian user.",
      "All amounts are in Indian Rupees (INR, ₹). Do NOT convert to any other currency.",
      "Do NOT mention USD, dollars, or any non-INR currency under any circumstances.",
      "Analyze the following expense data and return one plain-English insight in under 100 words.",
      "Include: a spending summary using ₹ amounts, the top 2 categories to cut back on, and one actionable saving tip.",
      "Base your advice strictly on the data provided. Do not assume or invent spending habits not reflected in the numbers.",
      `Expense data: ${JSON.stringify(sanitized)}`
    ].join("\n");

    const modelErrors = [];
    for (const modelName of GEMINI_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const insight = result.response.text().trim();

        if (insight) {
          return res.json({ insight });
        }
      } catch (error) {
        modelErrors.push({
          model: modelName,
          message: error?.message || String(error)
        });
      }
    }

    throw new Error(
      `Gemini failed for all models: ${modelErrors
        .map((item) => `${item.model}: ${item.message}`)
        .join(" | ")}`
    );
  } catch (error) {
    const message = error?.message || String(error);
    console.error("Gemini analyzeFinance error:", message);

    const fallbackInsight = buildFallbackInsight(sanitized);
    const isQuotaOrCapacityIssue =
      message.includes("quota") ||
      message.includes("429") ||
      message.includes("high demand") ||
      message.includes("503");

    if (isQuotaOrCapacityIssue) {
      return res.json({
        insight: fallbackInsight,
        source: "fallback",
        message: "Gemini is temporarily unavailable (quota/capacity). Showing local insight."
      });
    }

    // Always return 200 with the fallback so the client can display it without
    // treating it as an error. The `source` field lets the UI distinguish AI vs local.
    return res.json({
      insight: fallbackInsight,
      source: "fallback",
      message: "AI insight unavailable. Showing local analysis."
    });
  }
};
