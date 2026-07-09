import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiArrowRight, FiHelpCircle, FiChevronDown } from "react-icons/fi";
import { useOutletContext, Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

export default function Pricing() {
  const { openAuthModal } = useOutletContext();
  const [isYearly, setIsYearly] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const pricingPlans = [
    {
      name: "Starter",
      description: "Essential money tracking tools for individuals.",
      priceMonthly: 0,
      priceYearly: 0,
      features: [
        "Up to 200 transactions / month",
        "Manual income & expense entry",
        "Basic visual analytics",
        "Standard categories",
        "Local browser backup"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Pro",
      description: "Unlock advanced command entries & analytics tools.",
      priceMonthly: 8,
      priceYearly: 6.4,
      features: [
        "Unlimited transactions",
        "Magic Command Input (Cmd+K)",
        "Advanced custom category budgets",
        "Goal setting & threshold triggers",
        "Export statements to PDF & CSV",
        "Priority premium support"
      ],
      cta: "Go Pro",
      popular: true
    },
    {
      name: "Enterprise",
      description: "Advanced controls for families and shared teams.",
      priceMonthly: 24,
      priceYearly: 19.2,
      features: [
        "Unlimited team shared spaces",
        "Role-based expense approvals",
        "Custom category mapping",
        "CSV auto-import sync engine",
        "Dedicated API key endpoint",
        "Dedicated account manager"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      q: "Can I cancel my subscription anytime?",
      a: "Yes, absolutely. You can cancel your subscription from your billing panel at any time. You'll retain access to Pro features until the end of your billing cycle."
    },
    {
      q: "How does the Magic Command Input work?",
      a: "The Magic Command Input (Cmd+K) allows you to add transactions using natural text. Simply type a description and amount like 'Groceries 50' and hit Enter. The app will auto-parse it into an expense record under the Food category, saving you manual clicks."
    },
    {
      q: "Is my financial data safe with Spendzy?",
      a: "Security is our highest priority. We authenticate using safe Firebase Auth flows and secure your data using custom Firestore Security Rules. We do not sell or share your data."
    },
    {
      q: "Do you offer discounts for annual plans?",
      a: "Yes! By purchasing an annual subscription, you receive a 20% discount compared to the monthly billing option, saving you money over the year."
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-white transition-colors duration-300">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[5%] w-[450px] h-[450px] bg-blue-500/[0.03] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 sm:py-24">
        
        {/* Header Hero */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <motion.div 
            variants={fadeUp} 
            className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider"
          >
            Pricing Plans
          </motion.div>
          
          <motion.h1 
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight mb-6"
          >
            Simple plans for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-300">
              financial peace of mind.
            </span>
          </motion.h1>
          
          <motion.p 
            variants={fadeUp}
            className="text-lg sm:text-xl text-neutral-500 dark:text-gray-400 leading-relaxed mb-8"
          >
            Choose the plan that fits your saving habits. Start tracking for free, upgrade when you need to unlock magic capabilities.
          </motion.p>
        </motion.div>

        {/* Toggle Billing State */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-16 sm:mb-20"
        >
          <span className={`text-sm font-semibold transition-colors duration-250 ${!isYearly ? "text-neutral-800 dark:text-white" : "text-neutral-400 dark:text-gray-500"}`}>
            Billed Monthly
          </span>
          
          <button 
            onClick={() => setIsYearly(!isYearly)}
            className="w-14 h-8 flex items-center bg-neutral-200 dark:bg-neutral-800 rounded-full p-1 cursor-pointer transition-colors duration-300 relative"
          >
            <motion.div 
              layout 
              className="w-6 h-6 bg-emerald-600 dark:bg-emerald-500 rounded-full shadow-md"
              animate={{ x: isYearly ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>

          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold transition-colors duration-250 ${isYearly ? "text-neutral-800 dark:text-white" : "text-neutral-400 dark:text-gray-500"}`}>
              Billed Annually
            </span>
            <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-md border border-emerald-500/20">
              Save 20%
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 sm:mb-32 items-stretch"
        >
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={`relative rounded-3xl p-8 flex flex-col justify-between border transition-all duration-300 hover:-translate-y-1 ${
                plan.popular 
                  ? "border-emerald-500/50 bg-white/90 dark:bg-emerald-500/[0.03] shadow-xl shadow-emerald-500/[0.04] ring-1 ring-emerald-500/20" 
                  : "border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-white/5 shadow-xs"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-600 text-white rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <div className="text-left mb-6">
                  <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2">{plan.name}</h3>
                  <p className="text-neutral-500 dark:text-gray-400 text-xs leading-relaxed">{plan.description}</p>
                </div>

                <div className="text-left mb-8 flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-extrabold text-neutral-800 dark:text-white">
                    ${isYearly ? plan.priceYearly : plan.priceMonthly}
                  </span>
                  <span className="text-neutral-400 dark:text-gray-400 text-sm font-semibold">/ month</span>
                </div>

                <ul className="space-y-4 mb-8 text-left border-t border-neutral-100 dark:border-neutral-800/60 pt-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-neutral-600 dark:text-gray-300 text-sm">
                      <FiCheck className="text-emerald-500 mt-0.5 shrink-0 text-base" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/signup"
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer ${
                  plan.popular
                    ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-500/10"
                    : "bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-white hover:bg-neutral-200 dark:hover:bg-white/10"
                }`}
              >
                {plan.cta}
                <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQs Accordion Block */}
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="text-3xl font-serif font-bold text-neutral-800 dark:text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-neutral-500 dark:text-gray-400 text-sm sm:text-base">Got questions? We have answers. If you need anything else, feel free to contact support.</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i}
                className="border border-neutral-200/65 dark:border-white/10 bg-white/70 dark:bg-white/5 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-neutral-800 dark:text-white text-sm sm:text-base cursor-pointer hover:bg-neutral-50 dark:hover:bg-white/[0.01] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FiHelpCircle className="text-neutral-400 dark:text-gray-500 shrink-0 text-base" />
                    <span>{faq.q}</span>
                  </div>
                  <FiChevronDown className={`text-neutral-400 dark:text-gray-500 transition-transform duration-300 ${activeFaq === i ? "rotate-180" : ""}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 text-neutral-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed border-t border-neutral-100 dark:border-neutral-800/60">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
