import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import SignupSignin from "../components/SignupSignin";
import ThemeToggle from "../components/Common/ThemeToggle";
import Logo from "../components/Common/Logo";

export default function Signup() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <div className="relative h-screen overflow-hidden w-full flex flex-col justify-between bg-[#faf8f5] dark:bg-[#08080a] text-neutral-800 dark:text-white transition-colors duration-300">
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-75 bg-emerald-500/5 dark:bg-emerald-500/[0.035] rounded-full blur-[120px]" />
      </div>

      <header className="relative z-10 w-full pt-3 sm:pt-4">
        <div className="w-11/12 mx-auto flex items-center justify-between">
          <Logo to="/" showName size="w-6 h-6" nameSize="text-lg" />

          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-all cursor-pointer"
            >
              <FiArrowLeft className="text-sm transition-transform group-hover:-translate-x-0.5" />
              <span>Back to home</span>
            </Link>
            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-4 py-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-97.5"
        >
          <div className="rounded-3xl border border-neutral-200/80 dark:border-white/8 bg-white/80 dark:bg-[#111114]/80 backdrop-blur-xl p-5 sm:p-6 shadow-xl shadow-black/2 dark:shadow-2xl dark:shadow-black/60">
            <SignupSignin key={location.pathname} initialLogin={isLogin} />
          </div>
        </motion.div>
      </main>

    </div>
  );
}
