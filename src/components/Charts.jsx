import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTheme } from "../hooks/useTheme";

const CATEGORY_COLORS = [
  "#10b981",
  "#8b5cf6",
  "#0ea5e9",
  "#f59e0b",
  "#f43f5e",
  "#6366f1",
  "#14b8a6",
  "#ec4899",
  "#f97316",
  "#64748b",
];

function formatCurrency(val, currency = "₹") {
  if (typeof val !== "number" || isNaN(val)) return `${currency}0`;
  return `${currency}${val.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function formatDateLabel(val) {
  if (!val) return "";
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return val;
  }
}

function CustomCashflowTooltip({ active, payload, label, currency, isDark }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className={`p-2.5 sm:p-3 rounded-xl border shadow-xl text-xs font-sans ${
        isDark
          ? "bg-neutral-900/95 border-neutral-800 text-neutral-100"
          : "bg-white/95 border-neutral-200 text-neutral-900"
      }`}
    >
      <p className="font-medium text-[11px] text-neutral-400 mb-1.5">
        {formatDateLabel(label)}
      </p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.stroke || entry.color }}
              />
              <span className="capitalize text-neutral-500 dark:text-neutral-400 text-[11px]">
                {entry.name}
              </span>
            </div>
            <span className="font-semibold tabular-nums text-xs">
              {formatCurrency(entry.value, currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Charts({ sortedTransactions = [], currency = "₹" }) {
  const [theme] = useTheme();
  const isDark = theme === "dark";

  const lineData = useMemo(() => {
    const map = {};

    sortedTransactions.forEach((txn) => {
      const dateKey = txn.date || "Unknown";
      if (!map[dateKey]) {
        map[dateKey] = {
          date: dateKey,
          income: 0,
          expense: 0,
        };
      }

      if (txn.type === "income") {
        map[dateKey].income += Number(txn.amount) || 0;
      } else {
        map[dateKey].expense += Number(txn.amount) || 0;
      }
    });

    return Object.values(map);
  }, [sortedTransactions]);

  const totalIncome = useMemo(() => {
    return sortedTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [sortedTransactions]);

  const totalExpense = useMemo(() => {
    return sortedTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [sortedTransactions]);

  const pieData = useMemo(() => {
    const grouped = {};

    sortedTransactions
      .filter((txn) => txn.type === "expense")
      .forEach((txn) => {
        const tag = txn.tag?.trim() || "General";
        grouped[tag] = (grouped[tag] || 0) + (Number(txn.amount) || 0);
      });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [sortedTransactions]);

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* Cash Flow Chart */}
      <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-3.5 sm:p-5 md:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-4 sm:mb-5">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Cash Flow
          </h2>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-neutral-500 dark:text-neutral-400">Income</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                {formatCurrency(totalIncome, currency)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span className="text-neutral-500 dark:text-neutral-400">Expenses</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                {formatCurrency(totalExpense, currency)}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full h-[220px] sm:h-[260px] md:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={lineData}
              margin={{ top: 10, right: 8, left: -20, bottom: 18 }}
            >
              <defs>
                <linearGradient id="flowIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="flowExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke={isDark ? "#262626" : "#f1f1f1"}
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                stroke={isDark ? "#737373" : "#a3a3a3"}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                height={24}
                minTickGap={24}
                tickFormatter={formatDateLabel}
              />

              <YAxis
                stroke={isDark ? "#737373" : "#a3a3a3"}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dx={-2}
                width={36}
                tickFormatter={(v) => {
                  if (v === 0) return "0";
                  if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(0)}k`;
                  return v;
                }}
              />

              <Tooltip
                content={<CustomCashflowTooltip currency={currency} isDark={isDark} />}
              />

              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#flowIncome)"
                dot={false}
                activeDot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
              />

              <Area
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#flowExpense)"
                dot={false}
                activeDot={{ r: 4, fill: "#f43f5e", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Breakdown Donut */}
      <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-3.5 sm:p-5 md:p-6 shadow-2xs">
        <div className="mb-4 sm:mb-5">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Expense Breakdown
          </h2>
        </div>

        {pieData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
            <div className="md:col-span-5 relative flex items-center justify-center h-[200px] sm:h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="90%"
                    paddingAngle={3}
                    cornerRadius={4}
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                        stroke={isDark ? "#171717" : "#ffffff"}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 block">
                  Total spent
                </span>
                <p className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-sans mt-0.5">
                  {formatCurrency(totalExpense, currency)}
                </p>
              </div>
            </div>

            <div className="md:col-span-7 space-y-2 sm:space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
              {pieData.map((item, index) => {
                const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
                const percentage =
                  totalExpense > 0 ? ((item.value / totalExpense) * 100).toFixed(1) : 0;

                return (
                  <div
                    key={item.name}
                    className="p-2 sm:p-2.5 rounded-xl border border-neutral-200/70 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/40 hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60 transition"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 capitalize truncate">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] sm:text-[11px] font-medium text-neutral-400 dark:text-neutral-500">
                          {percentage}%
                        </span>
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                          {formatCurrency(item.value, currency)}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-neutral-200/70 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-neutral-400 dark:text-neutral-500">
            No expenses recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
