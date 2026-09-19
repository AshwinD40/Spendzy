import React from "react";

function Button({ text, onClick, google, disabled, type = "button" }) {
  const base =
    "inline-flex h-9 sm:h-9.5 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs sm:text-sm font-semibold transition-all outline-none cursor-pointer disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

  const primary =
    "bg-emerald-500/85 dark:bg-emerald-400/80 backdrop-blur-md text-white border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_24px_rgba(16,185,129,0.25)] hover:bg-emerald-500 dark:hover:bg-emerald-400 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_32px_rgba(16,185,129,0.4)] focus-visible:ring-2 focus-visible:ring-emerald-500/25";

  const outline =
    "bg-white/40 dark:bg-white/[0.06] backdrop-blur-md text-neutral-700 dark:text-neutral-200 border border-white/50 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:bg-white/60 dark:hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-emerald-500/25";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${google ? outline : primary}`}
    >
      {text}
    </button>
  );
}

export default Button;
