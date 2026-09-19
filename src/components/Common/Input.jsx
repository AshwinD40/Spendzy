import React from "react";

function Input({ label, state, setState, placeholder, type = "text" }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-medium leading-none text-neutral-600 dark:text-neutral-300">
        {label}
      </label>
      <input
        type={type}
        value={state}
        onChange={(e) => setState(e.target.value)}
        placeholder={placeholder}
        className="flex h-9 w-full rounded-xl border border-neutral-300/60 dark:border-white/10 bg-neutral-100/50 dark:bg-white/4 backdrop-blur-md px-3 py-1.5 text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-50 placeholder:font-normal placeholder:text-neutral-400 dark:placeholder:text-neutral-500 shadow-2xs transition-all outline-none focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}

export default Input;
