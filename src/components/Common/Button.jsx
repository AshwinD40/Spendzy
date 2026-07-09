import React from "react";

function Button({ text, onClick, google, disabled, type = "button" }) {
  const base =
    "w-full flex items-center justify-center gap-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]";

  const primary =
    `
    px-6 py-3
    bg-emerald-600 text-white dark:bg-emerald-500/20 dark:text-emerald-300
    border border-emerald-600/20 dark:border-emerald-400/20
    shadow-[0_8px_30px_rgba(16,185,129,0.1)] dark:shadow-[0_8px_30px_rgba(16,185,129,0.15)]
    hover:bg-emerald-500 dark:hover:bg-emerald-500/30
    dark:hover:text-emerald-200
    hover:shadow-[0_10px_40px_rgba(16,185,129,0.25)]
    hover:scale-[1.01]
    `;

  const googleBtn =
    `
    px-6 py-3
    bg-neutral-200/60 dark:bg-white/5 text-neutral-800 dark:text-gray-200
    border border-neutral-300 dark:border-white/10
    shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.06)]
    hover:bg-neutral-200/90 dark:hover:bg-white/10
    hover:shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_10px_40px_rgba(255,255,255,0.1)]
    hover:scale-[1.01]
    `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${google ? googleBtn : primary}`}
    >
      {text}
    </button>
  );
}

export default Button;
