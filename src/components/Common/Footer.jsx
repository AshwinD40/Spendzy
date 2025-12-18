export default function Footer() {
  return (
    <footer className="relative mt-16">
      {/* ambient gradient glow */}
      <div className="absolute inset-x-0 -top-28 -z-10 flex justify-center pointer-events-none">
        <div className="w-[480px] h-[220px] bg-gradient-to-r from-blue-500/15 via-cyan-400/10 to-violet-500/15 blur-[140px] rounded-full" />
      </div>
     
      <div
        className=" mx-auto max-w-[1120px] px-6 py-6 rounded-2xl bg-gradient-to-br from-white/[0.06] via-white/[0.035] to-white/[0.02] backdrop-blur-[28px] border border-white/15 shadow-[0_25px_90px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-wide text-white">
            Spend
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              zy
            </span>
          </span>

          <span className="hidden sm:inline text-xs text-gray-500">
            Smart expense tracking
          </span>
        </div>

        {/* Credit */}
        <div className="text-center sm:text-right text-xs text-gray-400">
          <p>
            Designed &amp; Developed by{" "}
            <span
              className="
                font-semibold
                bg-gradient-to-r
                from-emerald-400
                via-cyan-400
                to-blue-400
                bg-clip-text
                text-transparent
              "
            >
              Ashwin
            </span>
          </p>

          <p className="text-[11px] text-gray-500 mt-0.5">
            © {new Date().getFullYear()} Spendzy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
