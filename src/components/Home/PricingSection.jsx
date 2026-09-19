import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCheck, FiChevronDown, FiCompass, FiZap, FiAward } from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const pricingPlans = [
  {
    name: "Starter",
    icon: <FiCompass className="text-lg text-emerald-500" />,
    priceMonthly: "0",
    priceYearly: "0",
    description: "Essential tools for personal tracking and basic overview.",
    features: [
      "Unlimited transaction logging",
      "Single-pane dashboard view",
      "Command shortcuts (Ctrl+K)",
      "Standard spending categories",
      "Local browser persistence",
    ],
    cta: "Get started",
    popular: false,
  },
  {
    name: "Pro",
    icon: <FiZap className="text-lg text-emerald-500" />,
    priceMonthly: "5",
    priceYearly: "4",
    description: "Advanced budgeting and analytics for proactive savers.",
    features: [
      "Everything in Starter",
      "Monthly budget caps & alerts",
      "Interactive analytics charts",
      "Multi-currency support",
      "Cloud sync across devices",
      "CSV export and import",
    ],
    cta: "Start with Pro",
    popular: true,
  },
  {
    name: "Lifetime",
    icon: <FiAward className="text-lg text-emerald-500" />,
    priceMonthly: "49",
    priceYearly: "49",
    description: "One-time investment for lifetime updates and support.",
    features: [
      "All current and future Pro features",
      "Lifetime updates included",
      "Priority customer assistance",
      "Early preview of new tools",
      "Zero recurring fees ever",
    ],
    cta: "Get lifetime access",
    popular: false,
  },
];

const faqs = [
  {
    q: "Can I use Spendzy for free?",
    a: "Yes, our Starter plan is completely free forever. You can track transactions, view categories, and monitor cash flow at zero cost.",
  },
  {
    q: "How does cloud sync work?",
    a: "Your records are saved securely to your Google Firebase account. Logging in on another device will immediately load your full data.",
  },
  {
    q: "Is my financial data private?",
    a: "Yes. Spendzy runs client-side with document-level security rules. We do not sell your information or share records with third parties.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, you can cancel or switch plans anytime from your account settings without extra fees or hidden lock-ins.",
  },
];

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <section
      id="pricing"
      className="relative z-10 w-11/12 mx-auto py-16 sm:py-20 border-t border-neutral-200 dark:border-neutral-800 scroll-mt-20"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="text-center max-w-2xl mx-auto mb-10"
      >
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-neutral-900 dark:text-white mb-3"
        >
          Straightforward pricing for <br />
          <span className="text-neutral-500 dark:text-neutral-400">
            every budget.
          </span>
        </motion.h2>
      </motion.div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-12">
        <span
          className={`text-sm font-medium transition-colors ${
            !isYearly ? "text-neutral-900 dark:text-white" : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          Monthly
        </span>

        <button
          type="button"
          onClick={() => setIsYearly(!isYearly)}
          aria-label="Toggle billing frequency"
          className="w-12 h-6 flex items-center bg-neutral-200 dark:bg-neutral-800 rounded-full p-0.5 cursor-pointer transition-colors relative"
        >
          <motion.div
            layout
            className="w-5 h-5 bg-emerald-600 dark:bg-emerald-500 rounded-full shadow-xs"
            animate={{ x: isYearly ? 24 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>

        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium transition-colors ${
              isYearly ? "text-neutral-900 dark:text-white" : "text-neutral-500 dark:text-neutral-400"
            }`}
          >
            Yearly
          </span>
          <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            Save 20%
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-stretch"
      >
        {pricingPlans.map((plan) => (
          <motion.div
            key={plan.name}
            variants={fadeUp}
            className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between border transition-all duration-200 ${
              plan.popular
                ? "border-emerald-500/60 bg-white dark:bg-neutral-900 shadow-md ring-1 ring-emerald-500/30"
                : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 shadow-2xs"
            }`}
          >
            <div>
              {/* Card Icon & Title in one single flex row line */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    {plan.icon}
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    {plan.name}
                  </h3>
                </div>

                {plan.popular && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-semibold">
                    Popular
                  </span>
                )}
              </div>

              <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed mb-6">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-geist">
                  ${isYearly ? plan.priceYearly : plan.priceMonthly}
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 text-xs font-medium">
                  {plan.name === "Lifetime" ? "one-time payment" : "/ month"}
                </span>
              </div>

              {/* Feature items */}
              <ul className="space-y-3 mb-8 border-t border-neutral-100 dark:border-neutral-800 pt-5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm"
                  >
                    <FiCheck className="text-emerald-500 mt-0.5 shrink-0 text-sm" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clean CTA button without arrow */}
            <Link
              to="/signup"
              className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all text-center cursor-pointer ${
                plan.popular
                  ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs"
                  : "bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              {plan.cta}
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-serif font-bold text-neutral-900 dark:text-white mb-2">
            Frequently asked questions
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Everything you need to know about Spendzy.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 rounded-xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-neutral-800 dark:text-white cursor-pointer"
              >
                <span>{faq.q}</span>
                <FiChevronDown
                  className={`text-neutral-400 transition-transform duration-200 shrink-0 ${
                    activeFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeFaq === i && (
                <div className="px-4 pb-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/80 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
