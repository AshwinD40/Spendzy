import React from "react";

function Button({ text, onClick, google, disabled, type = "button" }) {
  const base =
    "w-full flex items-center justify-center gap-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-xl disabled:opacity-50 disabled:cursor-not-allowed";

  const primary =
    `
    px-6 py-3
    bg-blue-500/20 text-blue-300
    border border-blue-400/20
    shadow-[0_8px_30px_rgba(59,130,246,0.15)]
    hover:bg-blue-500/30
    hover:text-blue-200
    hover:shadow-[0_10px_40px_rgba(59,130,246,0.25)]
    hover:scale-[1.02]
    `;

  const googleBtn =
    `
    px-6 py-3
    bg-white/5 text-gray-200
    border border-white/10
    shadow-[0_8px_30px_rgba(255,255,255,0.06)]
    hover:bg-white/10
    hover:shadow-[0_10px_40px_rgba(255,255,255,0.1)]
    hover:scale-[1.02]
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
