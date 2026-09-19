import React from "react";
import { FiPlus, FiTrendingUp } from "react-icons/fi";

export default function NoTransaction({ showIncomeModal, showExpenseModal }) {
  return (
    <div className="w-full rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-8 sm:p-12 shadow-2xs text-center transition-colors">
      <div className="flex flex-col items-center max-w-sm mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4">
          <FiTrendingUp className="text-2xl" />
        </div>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          No financial records yet
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 mb-6 leading-relaxed">
          Start recording your income and expenses to unlock real-time cash flow analytics, breakdown charts, and balance tracking.
        </p>

        <div className="flex items-center gap-2.5">
          {showIncomeModal && (
            <button
              type="button"
              onClick={showIncomeModal}
              className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition shadow-2xs active:scale-[0.98] cursor-pointer"
            >
              <FiPlus className="text-xs" />
              <span>Add income</span>
            </button>
          )}
          {showExpenseModal && (
            <button
              type="button"
              onClick={showExpenseModal}
              className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium transition shadow-2xs active:scale-[0.98] cursor-pointer"
            >
              <FiPlus className="text-xs" />
              <span>Add expense</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
