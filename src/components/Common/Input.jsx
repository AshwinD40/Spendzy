import React from "react";

function Input({ label, state, setState, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2 mb-4 sm:mb-5">
      
      {/* Label */}
      <label className="
        text-[10px] sm:text-xs
        uppercase tracking-widest
        text-gray-400
      ">
        {label}
      </label>

      {/* Input */}
      <input
        type={type}
        value={state}
        onChange={(e) => setState(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          rounded-lg sm:rounded-xl
          bg-white/10
          backdrop-blur-2xl
          border border-white/15
          px-3.5 sm:px-4
          py-2.5 sm:py-3
          text-sm sm:text-base
          text-white
          placeholder:text-gray-400
          outline-none
          transition-all duration-200
          focus:border-blue-400/60
          focus:bg-white/15
          focus:shadow-[0_0_0_3px_rgba(59,130,246,0.25)]
        "
      />
    </div>
  );
}

export default Input;
