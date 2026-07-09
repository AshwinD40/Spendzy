import React from "react";
import { motion } from "framer-motion";
import { FiStar, FiCheckCircle, FiUsers, FiTrendingUp, FiActivity } from "react-icons/fi";
import PlaygroundWidget from "../components/PlaygroundWidget";

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

export default function Customers() {
  const stats = [
    { label: "Active Savers", value: "48K+", icon: <FiUsers className="text-xl text-blue-500" /> },
    { label: "Total Transaction Volume", value: "$42M+", icon: <FiTrendingUp className="text-xl text-emerald-500" /> },
    { label: "App Store Rating", value: "4.9/5", icon: <FiStar className="text-xl text-yellow-500" /> }
  ];

  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Freelance Designer",
      rating: 5,
      comment: "Ditching Excel for Spendzy was the single best financial decision I made this year. I hit Cmd+K, type my dinner expense, and get back to work. Beautiful, fast, and stays out of my way.",
      avatar: "SJ"
    },
    {
      name: "Marcus Chen",
      role: "Software Architect",
      rating: 5,
      comment: "The command-line inspired input bar feels incredibly natural to use. Having React states reload with absolute zero lag is amazing. Privacy features with Firebase auth is exactly what I needed.",
      avatar: "MC"
    },
    {
      name: "Elena Rostova",
      role: "Personal Wealth Advisor",
      rating: 5,
      comment: "I recommend Spendzy to clients who struggle with traditional finance software. The single-pane concept reduces the friction of logging expenses, keeping them consistent.",
      avatar: "ER"
    },
    {
      name: "David K.",
      role: "Digital Nomad",
      rating: 5,
      comment: "Swiping between light and dark themes on my phone looks stunning. It supports custom currency settings, which is essential for working and spending across countries.",
      avatar: "DK"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-white transition-colors duration-300">
      
      {/* Ambience Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-96 h-96 bg-purple-500/[0.03] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 sm:py-24">
        
        {/* Header Section */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <motion.div 
            variants={fadeUp} 
            className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider"
          >
            Testimonials
          </motion.div>
          
          <motion.h1 
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight mb-6"
          >
            Loved by planners. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-300">
              Trusted by builders.
            </span>
          </motion.h1>
          
          <motion.p 
            variants={fadeUp}
            className="text-lg sm:text-xl text-neutral-500 dark:text-gray-400 leading-relaxed"
          >
            See how freelancers, developers, and wealth builders use Spendzy to gain total awareness of their transactions.
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20 sm:mb-28"
        >
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className="flex items-center gap-4 p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-white/5 shadow-xs"
            >
              <div className="p-3.5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-white/5 rounded-2xl">
                {stat.icon}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-3xl font-extrabold tracking-tight text-neutral-800 dark:text-white">{stat.value}</span>
                <span className="text-xs text-neutral-400 dark:text-gray-400 mt-1 font-semibold uppercase tracking-wider">{stat.label}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Interactive Showcase & Playground Split */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-24 sm:mb-32">
          
          {/* Left: Playground Description */}
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 text-left"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-800 dark:text-white mb-6">
              Test drive the interface yourself
            </h2>
            <p className="text-neutral-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
              Don't just take our customers' word for it. Try our interactive calculator widget right here. Type an amount, pick transaction type, and see how the state handles details instantly.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FiCheckCircle className="text-emerald-500 text-lg mt-0.5 shrink-0" />
                <span className="text-neutral-600 dark:text-gray-300 text-sm font-medium">Add, toggle, and filter records with zero lag.</span>
              </div>
              <div className="flex items-start gap-3">
                <FiCheckCircle className="text-emerald-500 text-lg mt-0.5 shrink-0" />
                <span className="text-neutral-600 dark:text-gray-300 text-sm font-medium">Clean, visual feed updates on change.</span>
              </div>
              <div className="flex items-start gap-3">
                <FiCheckCircle className="text-emerald-500 text-lg mt-0.5 shrink-0" />
                <span className="text-neutral-600 dark:text-gray-300 text-sm font-medium">No account setup needed for this sandbox widget.</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Sandbox Widget */}
          <motion.div 
            initial={{ opacity: 0, x: 25, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 relative w-full max-w-[340px] mx-auto lg:mr-0 lg:ml-auto"
          >
            <div className="absolute inset-0 bg-emerald-600/10 rounded-[28px] blur-2xl transform scale-95 translate-y-3"></div>
            <div className="relative rounded-[28px] ring-1 ring-neutral-200 dark:ring-[#333] shadow-2xl overflow-hidden bg-white dark:bg-[#111]">
              <PlaygroundWidget />
            </div>
          </motion.div>

        </div>

        {/* Testimonials Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              className="p-6 sm:p-8 rounded-3xl border border-neutral-200/60 dark:border-white/10 bg-white/70 dark:bg-white/5 text-left hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-sm"
            >
              <div className="flex items-center gap-1 mb-4 text-amber-500 dark:text-amber-400">
                {[...Array(t.rating)].map((_, i) => <FiStar key={i} className="fill-current text-sm" />)}
              </div>
              
              <p className="text-neutral-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-6 font-medium italic">
                "{t.comment}"
              </p>

              <div className="flex items-center gap-3.5 border-t border-neutral-100 dark:border-neutral-800/60 pt-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-sm">
                  {t.avatar}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-neutral-800 dark:text-white leading-none">{t.name}</span>
                  <span className="text-[10px] text-neutral-400 dark:text-gray-400 mt-1 font-semibold uppercase tracking-wider leading-none">{t.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
