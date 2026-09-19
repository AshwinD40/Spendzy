import React, { useMemo } from "react";
import { useOutletContext, Link } from "react-router-dom";
import {
  FiPlus,
  FiArrowRight,
  FiArrowUpRight,
  FiArrowDownRight,
} from "react-icons/fi";
import Cards from "../../components/Common/Cards";
import Charts from "../../components/Charts";
import NoTransaction from "../../components/Common/NoTransaction";

function formatAmount(amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "0";
  return amount.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export default function OverviewView() {
  const {
    transactions = [],
    showExpenseModal,
    showIncomeModal,
    currency = "₹",
  } = useOutletContext();

  const incomeTransactions = useMemo(
    () => transactions.filter((t) => t.type === "income"),
    [transactions]
  );
  const expenseTransactions = useMemo(
    () => transactions.filter((t) => t.type === "expense"),
    [transactions]
  );

  const income = useMemo(
    () => incomeTransactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0),
    [incomeTransactions]
  );
  const expense = useMemo(
    () => expenseTransactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0),
    [expenseTransactions]
  );
  const totalBalance = income - expense;

  const sortedTransactions = useMemo(
    () =>
      [...transactions].sort(
        (a, b) => new Date(a.date || 0) - new Date(b.date || 0)
      ),
    [transactions]
  );

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 5),
    [transactions]
  );

  const hasTransactions = transactions.length > 0;

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Overview
        </h1>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={showIncomeModal}
            className="inline-flex items-center gap-1 sm:gap-1.5 h-8 px-2.5 sm:px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition shadow-2xs active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            <FiPlus className="text-xs shrink-0" />
            <span className="sm:hidden">Income</span>
            <span className="hidden sm:inline">Add income</span>
          </button>
          <button
            type="button"
            onClick={showExpenseModal}
            className="inline-flex items-center gap-1 sm:gap-1.5 h-8 px-2.5 sm:px-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium transition shadow-2xs active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            <FiPlus className="text-xs shrink-0" />
            <span className="sm:hidden">Expense</span>
            <span className="hidden sm:inline">Add expense</span>
          </button>
        </div>
      </div>

      <Cards
        income={income}
        expense={expense}
        totalBalance={totalBalance}
        currency={currency}
      />

      {hasTransactions ? (
        <div className="space-y-4 sm:space-y-6">
          <Charts
            sortedTransactions={sortedTransactions}
            currency={currency}
          />

          <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-4 sm:p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Recent Activity
              </h2>

              <Link
                to="/app/transactions"
                className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition"
              >
                <span>View all</span>
                <FiArrowRight className="text-[11px]" />
              </Link>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {recentTransactions.map((txn, idx) => {
                const isIncome = txn.type === "income";
                return (
                  <div
                    key={txn.id || idx}
                    className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isIncome
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {isIncome ? (
                          <FiArrowUpRight className="text-xs font-bold" />
                        ) : (
                          <FiArrowDownRight className="text-xs font-bold" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate">
                          {txn.name || (isIncome ? "Income" : "Expense")}
                        </p>
                        <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                            {txn.date || "Today"}
                          </span>
                          {txn.tag && (
                            <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                              {txn.tag}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <span
                        className={`text-xs font-semibold tabular-nums ${
                          isIncome
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-neutral-900 dark:text-neutral-100"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {currency}
                        {formatAmount(Number(txn.amount) || 0)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <NoTransaction
          showIncomeModal={showIncomeModal}
          showExpenseModal={showExpenseModal}
        />
      )}
    </div>
  );
}
