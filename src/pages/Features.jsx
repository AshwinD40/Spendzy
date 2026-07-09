import React from "react";
import { motion } from "framer-motion";
import { FiLayout, FiCommand, FiPieChart, FiZap, FiShield, FiTrendingUp } from "react-icons/fi";

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

export default function Features() {
  const featureList = [
    {
      icon: <FiLayout className="text-3xl text-emerald-500" />,
      title: "Single-Pane Command Center",
      description: "Manage your budgets, examine records, add transactions, and visualize progress in real-time from a single workspace view. Say goodbye to multi-tab confusion.",
      badge: "Core Feature"
    },
    {
      icon: <FiCommand className="text-3xl text-blue-500" />,
      title: "Magic Input Command",
      description: "Press Ctrl+K from anywhere inside the app, describe a transaction in natural language (e.g. 'Lunch 15' or 'Freelance 500'), and watch the app auto-parse it.",
      badge: "New"
    },
    {
      icon: <FiPieChart className="text-3xl text-purple-500" />,
      title: "Deep Analytics & Insights",
      description: "Automatically segment income and expenses into beautifully rendered pie and line charts. Identify cash flow patterns, overspending habits, and saving potentials.",
      badge: "Visuals"
    },
    {
      icon: <FiZap className="text-3xl text-yellow-500" />,
      title: "Lightning-Fast Execution",
      description: "Engineered with React optimized states and stateful transitions. Actions happen instantly in your browser with optimistic local updates.",
      badge: "Performance"
    },
    {
      icon: <FiShield className="text-3xl text-red-500" />,
      title: "Firebase Secured Architecture",
      description: "Your financial records are backed by robust Firebase Security Rules. Fully encrypted auth sessions keep your data visible only to you.",
      badge: "Security"
    },
    {
      icon: <FiTrendingUp className="text-3xl text-teal-500" />,
      title: "Budgets & Goal Setting",
      description: "Set monthly caps for different categories. Get warning visualizers as you approach limits, encouraging consistent, disciplined money tracking.",
      badge: "Smart Budgets"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-white transition-colors duration-300">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 sm:py-24">
        
        {/* Header Hero Section */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-24"
        >
          <motion.div 
            variants={fadeUp} 
            className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider"
          >
            Capabilities
          </motion.div>
          
          <motion.h1 
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight mb-6"
          >
            Everything designed to make <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400">
              money management simple.
            </span>
          </motion.h1>
          
          <motion.p 
            variants={fadeUp}
            className="text-lg sm:text-xl text-neutral-500 dark:text-gray-400 leading-relaxed"
          >
            We've built all the core features you need to track, optimize, and grow your cash flow without the unnecessary complexity of spreadsheets.
          </motion.p>
        </motion.div>

        {/* Features Interactive Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {featureList.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              className="group relative rounded-3xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 sm:p-8 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-white/20 hover:shadow-xl hover:shadow-emerald-500/[0.02] hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-gray-400">
                    {feature.badge}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-neutral-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                  {feature.description}
                </p>
              </div>

              <div className="w-full border-t border-neutral-100 dark:border-neutral-800/60 pt-4 flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-500 group-hover:gap-1.5 transition-all">
                <span>Explore functionality</span>
                <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
      </div>
    </div>
  );
}
