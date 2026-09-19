import { motion } from "framer-motion";
import { FiStar, FiUsers, FiCheckCircle, FiSmile } from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const stats = [
  {
    icon: <FiUsers className="text-xl text-emerald-500" />,
    value: "10,000+",
    label: "Active budgeters",
  },
  {
    icon: <FiCheckCircle className="text-xl text-emerald-500" />,
    value: "₹4.2Cr+",
    label: "Logged securely",
  },
  {
    icon: <FiSmile className="text-xl text-emerald-500" />,
    value: "99.8%",
    label: "Satisfied users",
  },
];

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Freelance developer",
    avatar: "AR",
    rating: 5,
    comment:
      "Spendzy replaced my messy spreadsheets. The shorthand parser lets me record expenses in seconds without taking me away from my flow.",
  },
  {
    name: "Sarah Chen",
    role: "Product designer",
    avatar: "SC",
    rating: 5,
    comment:
      "The minimal interface is a breath of fresh air. Clean typography, instant feedback, and visual category bars give me clarity on my monthly burn rate.",
  },
  {
    name: "Marcus Vance",
    role: "Startup founder",
    avatar: "MV",
    rating: 5,
    comment:
      "The single-pane layout is brilliant. Having recent transactions, analytics, and budgets on one clean screen without tabs is exactly what I needed.",
  },
  {
    name: "Devon Kim",
    role: "Digital nomad",
    avatar: "DK",
    rating: 5,
    comment:
      "Clean dark mode, seamless currency switching, and instant local updates make this my go-to financial tracker wherever I travel.",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      id="reviews"
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
          Loved by planners. <br />
          <span className="text-neutral-500 dark:text-neutral-400">
            Trusted by builders.
          </span>
        </motion.h2>
      </motion.div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 shadow-2xs"
          >
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              {stat.icon}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-geist">
                {stat.value}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {testimonials.map((t) => (
          <motion.div
            key={t.name}
            variants={fadeUp}
            className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 text-left shadow-2xs flex flex-col justify-between"
          >
            <div>
              {/* Card Avatar & Author in one single flex row line */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                    {t.avatar}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-900 dark:text-white leading-tight">
                      {t.name}
                    </span>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500 leading-tight mt-0.5">
                      {t.role}
                    </span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 text-amber-500 dark:text-amber-400 text-xs">
                  {[...Array(t.rating)].map((_, i) => (
                    <FiStar key={i} className="fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                &ldquo;{t.comment}&rdquo;
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
