import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite"
].filter(Boolean);

// ── analyzeFinance helpers ────────────────────────────────────────────────────

const buildFallbackInsight = (items) => {
  const sorted = [...items].sort((a, b) => Number(b.amount) - Number(a.amount));
  const top =
    sorted.slice(0, 2).map((item) => item.category).join(" and ") ||
    "discretionary spending";
  const total = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return `You spent ₹${total.toFixed(0)} across tracked categories. Your biggest areas are ${top}. Review recurring purchases there, set a weekly cap, and move a fixed amount to savings right after payday.`;
};

// ── chatWithFinance helpers ───────────────────────────────────────────────────

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/**
 * Build a rule-based fallback reply when Gemini is unavailable.
 * Looks for keywords in the last user message and answers from the expense data.
 */
const buildChatFallback = (lastMessage, expenses, month, year) => {
  const q = lastMessage.toLowerCase();
  const total = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const monthName = MONTH_NAMES[(month || 1) - 1];

  // Aggregate by category
  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount || 0);
    return acc;
  }, {});
  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const topCat = sorted[0];
  const avg = expenses.length ? total / expenses.length : 0;

  if (q.includes("total") || q.includes("overall") || q.includes("spent")) {
    return `In ${monthName} ${year} you spent a total of ₹${total.toFixed(0)} across ${expenses.length} transaction${expenses.length !== 1 ? "s" : ""}.`;
  }
  if (q.includes("top") || q.includes("most") || q.includes("biggest") || q.includes("highest")) {
    if (!topCat) return "No expense data available for this month.";
    return `Your biggest spending category in ${monthName} ${year} is ${topCat[0]} at ₹${topCat[1].toFixed(0)}.`;
  }
  if (q.includes("average") || q.includes("avg")) {
    return `Your average spend per transaction in ${monthName} ${year} is ₹${avg.toFixed(0)}.`;
  }
  if (q.includes("categor") || q.includes("breakdown")) {
    if (!sorted.length) return "No expense data available for this month.";
    const lines = sorted.map(([cat, amt]) => `${cat}: ₹${amt.toFixed(0)}`).join(", ");
    return `Here's your ${monthName} ${year} breakdown — ${lines}.`;
  }
  if (q.includes("cut") || q.includes("save") || q.includes("reduce")) {
    if (!topCat) return "Add some expenses first and I can suggest where to cut back.";
    return `Your top area to cut back is ${topCat[0]} (₹${topCat[1].toFixed(0)}). Try setting a weekly cap for that category.`;
  }
  if (q.includes("compare") || q.includes("vs")) {
    if (sorted.length < 2) return "You need expenses in at least two categories to compare.";
    return `Your top two categories are ${sorted[0][0]} (₹${sorted[0][1].toFixed(0)}) and ${sorted[1][0]} (₹${sorted[1][1].toFixed(0)}).`;
  }

  return `I can see you have ${expenses.length} expense${expenses.length !== 1 ? "s" : ""} totalling ₹${total.toFixed(0)} in ${monthName} ${year}. Try asking about your total, top category, average spend, or where to cut back.`;
};

// ── analyzeFinance ────────────────────────────────────────────────────────────

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
        modelErrors.push({ model: modelName, message: error?.message || String(error) });
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

    return res.json({
      insight: fallbackInsight,
      source: "fallback",
      message: "AI insight unavailable. Showing local analysis."
    });
  }
};

// ── chatWithFinance ───────────────────────────────────────────────────────────

export const chatWithFinance = async (req, res) => {
  const { messages, expenses, month, year } = req.body;

  // Validate inputs
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ message: "messages must be a non-empty array" });
  }

  if (!Array.isArray(expenses)) {
    return res.status(400).json({ message: "expenses must be an array" });
  }

  // Sanitize expenses — only keep fields the AI needs
  const sanitizedExpenses = expenses.map(({ category, amount, title, date }) => ({
    category,
    amount: Number(amount || 0),
    title,
    date
  }));

  // Compute summary stats server-side so the AI has them ready
  const total = sanitizedExpenses.reduce((s, e) => s + e.amount, 0);
  const txCount = sanitizedExpenses.length;
  const byCategory = sanitizedExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const topCategory =
    Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  const monthName = MONTH_NAMES[(month || 1) - 1];

  // Build the system prompt injected as the first user turn
  const systemPrompt = [
    "You are a friendly personal finance assistant for an Indian user.",
    "All amounts are in Indian Rupees (INR, ₹). NEVER mention USD, dollars, or any other currency.",
    "Answer ONLY based on the expense data provided below. If asked something not in the data, say so clearly.",
    "Be concise — keep replies under 120 words. Use ₹ amounts when referencing specific figures.",
    "",
    `Context: ${monthName} ${year}`,
    `Total spent: ₹${total.toFixed(0)}`,
    `Transactions: ${txCount}`,
    `Top category: ${topCategory}`,
    "",
    `Full expense data: ${JSON.stringify(sanitizedExpenses)}`
  ].join("\n");

  // The last message is what the user just sent — everything before is history
  const lastMessage = messages[messages.length - 1];
  const historyMessages = messages.slice(0, -1);

  // Map to Gemini conversation format
  // Prepend the system prompt as the first user turn with a model acknowledgement
  const geminiHistory = [
    { role: "user", parts: [{ text: systemPrompt }] },
    {
      role: "model",
      parts: [
        {
          text: `Understood. I'm ready to answer questions about your ${monthName} ${year} expenses.`
        }
      ]
    },
    ...historyMessages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }))
  ];

  const geminiApiKey = process.env.GEMINI_API_KEY?.trim();

  if (!geminiApiKey) {
    const fallback = buildChatFallback(lastMessage.content, sanitizedExpenses, month, year);
    return res.json({ reply: fallback, source: "fallback" });
  }

  try {
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const modelErrors = [];

    for (const modelName of GEMINI_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const chat = model.startChat({
          history: geminiHistory,
          generationConfig: { maxOutputTokens: 300 }
        });

        const result = await chat.sendMessage(lastMessage.content);
        const reply = result.response.text().trim();

        if (reply) {
          return res.json({ reply });
        }
      } catch (error) {
        modelErrors.push({ model: modelName, message: error?.message || String(error) });
      }
    }

    throw new Error(
      `Gemini chat failed for all models: ${modelErrors
        .map((item) => `${item.model}: ${item.message}`)
        .join(" | ")}`
    );
  } catch (error) {
    const message = error?.message || String(error);
    console.error("Gemini chatWithFinance error:", message);

    // Always return 200 with a fallback so the UI never shows a broken state
    const fallback = buildChatFallback(lastMessage.content, sanitizedExpenses, month, year);
    return res.json({ reply: fallback, source: "fallback" });
  }
};
