import React from "react";

function formatAmount(amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "0";
  return amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

export default function Cards({
  income = 0,
  expense = 0,
  totalBalance = 0,
  currency = "₹",
}) {
  const isPositive = totalBalance >= 0;
  const savingsRate =
    income > 0 ? Math.max(0, Math.round(((income - expense) / income) * 100)) : 0;

  return (
    <div className="w-full pt-1 pb-1">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
              Total Balance
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                isPositive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              }`}
            >
              {isPositive ? "Surplus" : "Deficit"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white font-sans">
            {currency}
            {formatAmount(totalBalance)}
          </h2>
        </div>

        <div className="flex items-center gap-6 sm:gap-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 font-medium mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>Income</span>
            </div>
            <p className="text-base sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              +{currency}
              {formatAmount(income)}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 font-medium mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>Expenses</span>
            </div>
            <p className="text-base sm:text-xl font-bold text-rose-600 dark:text-rose-400 tabular-nums">
              -{currency}
              {formatAmount(expense)}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 font-medium mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              <span>Savings</span>
            </div>
            <p className="text-base sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
              {savingsRate}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
