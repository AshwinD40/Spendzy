import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowUp } from "react-icons/fi";

import Logo from "../components/Common/Logo";
import FeaturesSection from "../components/Home/FeaturesSection";
import TestimonialsSection from "../components/Home/TestimonialsSection";
import PricingSection from "../components/Home/PricingSection";
import SandboxSimulator from "../components/Home/SandboxSimulator";

/* ──────────── animation presets ──────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-white transition-colors duration-300">

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative z-10 pt-12 sm:pt-20 pb-16 sm:pb-24 w-11/12 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-16 items-center">

         
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center space-y-5"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Spendzy 2.0 is live</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-[52px] font-serif font-bold tracking-tight leading-[1.12] text-neutral-900 dark:text-white max-w-lg"
            >
              Money, finally <br />
              <span className="text-emerald-500">working for you.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-md"
            >
              The single-pane personal finance tracker engineered for speed. Track transactions, monitor budgets, and review records in seconds.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto"
            >
              <Link
                to="/signup"
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-xs text-center cursor-pointer active:scale-[0.98]"
              >
                Get started free
              </Link>

              <button
                type="button"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-sm transition-all text-center cursor-pointer active:scale-[0.98]"
              >
                Explore features
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full flex justify-center"
          >
            <SandboxSimulator />
          </motion.div>

        </div>
      </section>

      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />

      <footer className="relative z-10 border-t border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-950/50 py-12">
        <div className="w-11/12 mx-auto space-y-8">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col items-start gap-2">
              <Logo showName size="w-6 h-6" nameSize="text-lg" to="/" />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
                Single-pane personal finance tracker for clarity and conscious spending.
              </p>
            </div>

            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
              <button
                type="button"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="hover:text-emerald-500 transition-colors cursor-pointer"
              >
                Features
              </button>

              <button
                type="button"
                onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
                className="hover:text-emerald-500 transition-colors cursor-pointer"
              >
                Pricing
              </button>

              <button
                type="button"
                onClick={() => document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" })}
                className="hover:text-emerald-500 transition-colors cursor-pointer"
              >
                Reviews
              </button>

              <Link to="/login" className="hover:text-emerald-500 transition-colors">
                Log in
              </Link>

              <Link to="/signup" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                Get started
              </Link>
            </nav>
          </div>

          <div className="pt-6 border-t border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500">
            <span>&copy; {new Date().getFullYear()} Spendzy. All rights reserved.</span>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <FiArrowUp className="text-xs" />
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
}
