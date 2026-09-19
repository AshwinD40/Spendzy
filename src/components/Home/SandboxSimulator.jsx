import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCommand, FiArrowUpRight, FiArrowDownRight, FiPlus } from "react-icons/fi";

const BUDGET_LIMIT = 3000;

const INITIAL_TRANSACTIONS = [
  { id: 1, name: "SaaS subscription", amount: 1200, type: "expense", tag: "Bills" },
  { id: 2, name: "Freelance client", amount: 4500, type: "income", tag: "Salary" },
];

const PRESETS = [
  { label: "Dinner 450", text: "Dinner 450" },
  { label: "Bonus 2500", text: "Bonus 2500" },
  { label: "Taxi 180", text: "Taxi 180" },
];

function parseCommand(raw) {
  const parts = raw.trim().split(/\s+/);
  if (parts.length < 2) return null;

  const amount = Number(parts.at(-1));
  if (isNaN(amount) || amount <= 0) return null;

  const name = parts.slice(0, -1).join(" ");
  const lower = name.toLowerCase();

  const type = /salary|bonus|freelance|income|dividend|deposit/.test(lower)
    ? "income"
    : "expense";

  let tag = "General";
  if (/pizza|food|sushi|lunch|dinner|coffee|burger/.test(lower)) tag = "Food";
  else if (/uber|taxi|cab|train|bus|fuel/.test(lower)) tag = "Transport";
  else if (/netflix|movie|spotify|game|stream/.test(lower)) tag = "Entertainment";
  else if (/salary|freelance|bonus|dividend/.test(lower)) tag = "Salary";
  else if (/rent|bill|electricity|water|wifi/.test(lower)) tag = "Bills";

  return { name, amount, type, tag };
}

export default function SandboxSimulator() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [input, setInput] = useState("");
  const [income, setIncome] = useState(4500);
  const [expense, setExpense] = useState(1200);

  const balance = useMemo(() => income - expense, [income, expense]);
  const budgetPercent = useMemo(
    () => Math.min((expense / BUDGET_LIMIT) * 100, 100),
    [expense]
  );
  const isOverBudget = expense > BUDGET_LIMIT;

  const execute = (text) => {
    const parsed = parseCommand(text);
    if (!parsed) return;

    setTransactions((prev) => [
      { id: Date.now(), ...parsed },
      ...prev.slice(0, 2),
    ]);

    if (parsed.type === "income") {
      setIncome((prev) => prev + parsed.amount);
    } else {
      setExpense((prev) => prev + parsed.amount);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    execute(input);
    setInput("");
  };

  return (
    <div className="w-full rounded-2xl border border-neutral-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0f0f12] p-6 sm:p-8 shadow-xl dark:shadow-2xl space-y-6 text-left transition-all">
      
      {/* Top Header & Context */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            Interactive simulation
          </span>
        </div>

        <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
          Monthly limit: ₹{BUDGET_LIMIT.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Hero Balance Summary with Generous White Space */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 block mb-1">
              Current balance
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-geist">
              ₹{balance.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <FiArrowUpRight className="text-sm" />
              <span>+₹{income.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
              <FiArrowDownRight className="text-sm" />
              <span>-₹{expense.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Minimal Thin Budget Progress Line */}
        <div className="space-y-1.5 pt-1">
          <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverBudget
                  ? "bg-rose-500"
                  : budgetPercent > 80
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${budgetPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
            <span>₹{expense.toLocaleString("en-IN")} spent</span>
            <span>{Math.round(budgetPercent)}% of limit</span>
          </div>
        </div>
      </div>

      {/* Spotlight Command Input */}
      <div className="space-y-2.5 pt-2">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <FiCommand className="absolute left-3.5 text-neutral-400 text-sm pointer-events-none" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type e.g., "Dinner 450" or "Salary 5000"'
            className="w-full h-11 pl-10 pr-20 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm font-medium text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors shadow-2xs"
          />
          <button
            type="submit"
            className="absolute right-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Add
          </button>
        </form>

        {/* Preset Quick Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 mr-1">
            Suggestions:
          </span>
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => execute(preset.text)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60 transition-colors cursor-pointer"
            >
              <FiPlus className="text-[10px] text-emerald-500" />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clean Transaction Feed */}
      <div className="space-y-2 pt-2">
        <div className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 pb-1">
          Recent transactions
        </div>

        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {transactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800/80"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300">
                    {tx.tag}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white">
                    {tx.name}
                  </span>
                </div>

                <div
                  className={`text-xs sm:text-sm font-bold font-geist tabular-nums ${
                    tx.type === "income"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
