import { FiArrowUpRight, FiArrowDownRight, FiCreditCard, FiPlus } from "react-icons/fi";

function formatAmount(amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "0";
  return amount.toLocaleString("en-IN");
}

function Cards({
  showExpenseModal,
  showIncomeModal,
  income,
  expense,
  totalBalance,
  currency = "₹"
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      {/* Current Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-5 shadow-sm dark:shadow-none transition-all duration-300 hover:shadow-md dark:hover:border-white/20">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-neutral-200/20 dark:from-neutral-900/50 via-transparent to-transparent opacity-50" />
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-neutral-400">
              <FiCreditCard className="text-sm" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Current Balance
            </span>
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white font-geist tracking-tight">
          {currency}{formatAmount(totalBalance)}
        </p>
      </div>

      {/* Income Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-5 shadow-sm dark:shadow-none transition-all duration-300 hover:shadow-md dark:hover:border-white/20">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-neutral-200/20 dark:from-neutral-900/50 via-transparent to-transparent opacity-50" />
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FiArrowUpRight className="text-sm" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Income
            </span>
          </div>
          <button 
            onClick={showIncomeModal}
            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/30 transition-all cursor-pointer flex items-center justify-center active:scale-95 z-10"
            title="Add Income"
          >
            <FiPlus className="text-xs font-bold" />
          </button>
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-geist tracking-tight">
          {currency}{formatAmount(income)}
        </p>
      </div>

      {/* Expense Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-5 shadow-sm dark:shadow-none transition-all duration-300 hover:shadow-md dark:hover:border-white/20">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-neutral-200/20 dark:from-neutral-900/50 via-transparent to-transparent opacity-50" />
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <FiArrowDownRight className="text-sm" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Expenses
            </span>
          </div>
          <button 
            onClick={showExpenseModal}
            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:border-rose-500/30 transition-all cursor-pointer flex items-center justify-center active:scale-95 z-10"
            title="Add Expense"
          >
            <FiPlus className="text-xs font-bold" />
          </button>
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 font-geist tracking-tight">
          {currency}{formatAmount(expense)}
        </p>
      </div>
    </div>
  );
}

export default Cards;
