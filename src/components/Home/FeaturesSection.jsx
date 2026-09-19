import { motion } from "framer-motion";
import { FiLayout, FiCommand, FiPieChart, FiZap, FiShield, FiTrendingUp } from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const featureList = [
  {
    icon: <FiLayout className="text-lg text-emerald-500" />,
    title: "Single-pane workspace",
    description:
      "Manage budgets, review records, and view progress in real time from one clean view without tab clutter.",
    badge: "Core",
  },
  {
    icon: <FiCommand className="text-lg text-emerald-500" />,
    title: "Command shortcuts",
    description:
      "Press Ctrl+K anywhere to log entries in plain text like 'Lunch 450' or 'Bonus 5000' with instant parsing.",
    badge: "Fast",
  },
  {
    icon: <FiPieChart className="text-lg text-emerald-500" />,
    title: "Clear visual breakdown",
    description:
      "Segment income and expenses into clean charts to understand where your money flows each month.",
    badge: "Analytics",
  },
  {
    icon: <FiZap className="text-lg text-emerald-500" />,
    title: "Optimistic performance",
    description:
      "Engineered for rapid local state updates so adding and filtering transactions feels instantaneous.",
    badge: "Speed",
  },
  {
    icon: <FiShield className="text-lg text-emerald-500" />,
    title: "Private and secure",
    description:
      "Built with strict Firebase security rules. Your financial entries remain private and accessible only to you.",
    badge: "Security",
  },
  {
    icon: <FiTrendingUp className="text-lg text-emerald-500" />,
    title: "Monthly spending limits",
    description:
      "Set category budgets with real-time indicators to keep expenses on track before overspending happens.",
    badge: "Budgets",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative z-10 w-11/12 mx-auto py-16 sm:py-20 border-t border-neutral-200 dark:border-neutral-800 scroll-mt-20"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-neutral-900 dark:text-white"
        >
          Everything you need for <br />
          <span className="text-neutral-500 dark:text-neutral-400">
            simple money tracking.
          </span>
        </motion.h2>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {featureList.map((feature) => (
          <motion.div
            key={feature.title}
            variants={fadeUp}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 shadow-2xs"
          >
            <div>
              {/* Card Icon & Title in one horizontal flex row */}
              <div className="flex items-center justify-between gap-3 mb-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white truncate">
                    {feature.title}
                  </h3>
                </div>

                <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 shrink-0">
                  {feature.badge}
                </span>
              </div>

              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
