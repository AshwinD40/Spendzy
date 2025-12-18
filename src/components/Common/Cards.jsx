import React from "react";
import Button from "../Common/Button";

function formatAmount(amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "0";
  return amount.toLocaleString("en-IN");
}

function Cards({
  showExpenseModal,
  showIncomeModal,
  income,
  expense,
  totalBalance
}) {
  return (
    <div
      className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full "
    >
      {/* Balance */}
      <GlassCard title="Current Balance">
        <p className="text-3xl font-semibold text-white">
          ₹ {formatAmount(totalBalance)}
        </p>
        <div className="mt-5">
          <Button text="Reset Balance" />
        </div>
      </GlassCard>

      {/* Income */}
      <GlassCard title="Income" accent="emerald">
        <p className="text-3xl font-semibold text-emerald-300">
          ₹ {formatAmount(income)}
        </p>
        <div className="mt-5">
          <Button text="Add Income" onClick={showIncomeModal} />
        </div>
      </GlassCard>

      {/* Expense */}
      <GlassCard title="Expenses" accent="rose">
        <p className="text-3xl font-semibold text-rose-300">
          ₹ {formatAmount(expense)}
        </p>
        <div className="mt-5">
          <Button text="Add Expense" onClick={showExpenseModal} />
        </div>
      </GlassCard>
    </div>
  );
}

/* ---- Premium Glass Card ---- */

function GlassCard({ title, accent, children }) {
  const accentBorder =
    accent === "emerald"
      ? "border-emerald-400/20"
      : accent === "rose"
      ? "border-rose-400/20"
      : "border-white/15";

  return (
    <div
      className={`
        relative
        rounded-2xl
        bg-white/5
        backdrop-blur-[30px]
        border ${accentBorder}
        p-5 sm:p-6
        text-white
        shadow-[0_25px_80px_rgba(0,0,0,0.25)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_35px_90px_rgba(0,0,0,0.35)]
      `}
    >
      {/* iOS-style inner highlight */}
      <div className=" pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-zinc-900 via-transparent to-transparent opacity-50" />

      <h2 className="relative text-[11px] uppercase tracking-widest text-gray-300 mb-3">
        {title}
      </h2>

      <div className="relative">{children}</div>
    </div>
  );
}

export default Cards;
