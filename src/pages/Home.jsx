import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOutletContext, Link } from "react-router-dom";
import { 
  FiArrowRight, 
  FiCommand, 
  FiPieChart, 
  FiLayout, 
  FiZap, 
  FiPlus, 
  FiArrowUpRight, 
  FiArrowDownRight, 
  FiUsers, 
  FiShield, 
  FiTrendingUp, 
  FiAlertTriangle,
  FiLock,
  FiEye,
  FiServer
} from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Home() {
  const { openAuthModal } = useOutletContext();

  // Dashboard Simulator State
  const [simTransactions, setSimTransactions] = useState([
    { id: 1, name: "SaaS Subscription", amount: 1200, type: "expense", tag: "Bills", date: "Today" },
    { id: 2, name: "Freelance Payment", amount: 4500, type: "income", tag: "Salary", date: "Today" },
  ]);
  const [simInput, setSimInput] = useState("");
  const [simIncome, setSimIncome] = useState(4500);
  const [simExpense, setSimExpense] = useState(1200);
  const simBudgetLimit = 3000;

  // Preset Command Chips
  const commandChips = [
    { label: "🍕 Pizza 450", text: "Pizza 450" },
    { label: "💰 Bonus 2500", text: "Bonus 2500" },
    { label: "🚕 Uber 180", text: "Uber 180" },
    { label: "🍿 Netflix 650", text: "Netflix 650" }
  ];

  // Helper to parse CLI shorthand
  const parseCommand = (inputStr) => {
    const trimmed = inputStr.trim();
    if (!trimmed) return null;
    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) return null;
    
    const amountVal = Number(parts[parts.length - 1]);
    if (isNaN(amountVal) || amountVal <= 0) return null;
    
    const nameVal = parts.slice(0, -1).join(" ");
    const nameLower = nameVal.toLowerCase();
    
    // Guess type
    let type = "expense";
    if (
      nameLower.includes("salary") || 
      nameLower.includes("bonus") || 
      nameLower.includes("freelance") || 
      nameLower.includes("income") ||
      nameLower.includes("dividend")
    ) {
      type = "income";
    }
    
    // Guess tag
    let tag = "Other";
    if (nameLower.includes("pizza") || nameLower.includes("food") || nameLower.includes("sushi") || nameLower.includes("lunch") || nameLower.includes("dinner")) {
      tag = "Food";
    } else if (nameLower.includes("uber") || nameLower.includes("taxi") || nameLower.includes("cab") || nameLower.includes("train") || nameLower.includes("bus")) {
      tag = "Transport";
    } else if (nameLower.includes("netflix") || nameLower.includes("movie") || nameLower.includes("spotify") || nameLower.includes("game")) {
      tag = "Entertainment";
    } else if (nameLower.includes("salary") || nameLower.includes("freelance") || nameLower.includes("bonus")) {
      tag = "Salary";
    } else if (nameLower.includes("rent") || nameLower.includes("bill") || nameLower.includes("electricity") || nameLower.includes("water")) {
      tag = "Bills";
    }
    
    return { name: nameVal, amount: amountVal, type, tag };
  };

  const handleSimSubmit = (e) => {
    e.preventDefault();
    if (!simInput) return;
    executeSimCommand(simInput);
    setSimInput("");
  };

  const executeSimCommand = (commandText) => {
    const parsed = parseCommand(commandText);
    if (!parsed) return;

    const newTx = {
      id: Date.now(),
      name: parsed.name,
      amount: parsed.amount,
      type: parsed.type,
      tag: parsed.tag,
      date: "Just now"
    };

    setSimTransactions(prev => [newTx, ...prev.slice(0, 3)]);
    if (parsed.type === "income") {
      setSimIncome(prev => prev + parsed.amount);
    } else {
      setSimExpense(prev => prev + parsed.amount);
    }
  };

  const simBalance = useMemo(() => simIncome - simExpense, [simIncome, simExpense]);
  const budgetProgressPercent = useMemo(() => {
    return Math.min((simExpense / simBudgetLimit) * 100, 100);
  }, [simExpense]);
  const isBudgetExceeded = useMemo(() => simExpense > simBudgetLimit, [simExpense]);

  const coreFeatures = [
    {
      icon: <FiLayout className="text-2xl text-emerald-500" />,
      title: "Single-Pane Command Center",
      text: "Track balances, log cash flows, inspect visual charts, and set limits from one fluid sidebar workspace view."
    },
    {
      icon: <FiCommand className="text-2xl text-blue-500" />,
      title: "Magic Input Parse Engine",
      text: "Fully working keyboard modal triggers. Press Ctrl+K, type simple shorthand parameters, and let the parser assign tags."
    },
    {
      icon: <FiPieChart className="text-2xl text-purple-500" />,
      title: "Color-Coded Analytics",
      text: "Spot trends over weeks or months. Beautifully rendered charts update instantly as soon as transactions are logged."
    },
    {
      icon: <FiZap className="text-2xl text-yellow-500" />,
      title: "Zero Reload Performance",
      text: "Optimistic UI state handlers update balances instantly in the browser background while syncing safely to Firebase."
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-white transition-colors duration-300">
      
      {/* Grainy Ambient Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
        <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] bg-emerald-500/[0.04] rounded-full blur-3xl"></div>
        <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-3xl"></div>
      </div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative z-10 pt-10 pb-16 sm:pb-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Hero Content (Left) */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 text-left flex flex-col items-start"
          >
            <motion.div variants={fadeUp} className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Spendzy 2.0 is live
            </motion.div>

            <motion.h1 
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.15]"
            >
              Money, finally <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400">
                working for you.
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeUp}
              className="mt-4 text-base sm:text-lg text-neutral-500 dark:text-gray-400 leading-relaxed"
            >
              The ultimate single-pane financial dashboard. Ditch complex, slow spreadsheets. Track transactions, analyze budgets, and review records in seconds.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-6 flex flex-col sm:flex-row items-center gap-4 w-full">
              <Link
                to="/signup"
                className="w-full sm:w-auto group flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-base hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                Get started for free
                <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              
              <Link
                to="/features"
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-7 py-3.5 rounded-2xl bg-neutral-200/50 dark:bg-white/5 border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-white font-bold text-base hover:bg-neutral-300 dark:hover:bg-white/10 transition-all text-center"
              >
                Explore Features
              </Link>
            </motion.div>
          </motion.div>

          {/* Interactive App Sandbox Simulator (Right - Hook Step) */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 100, damping: 20 }}
            className="lg:col-span-7 relative w-full max-w-[500px] mx-auto lg:mr-0 mt-8 lg:mt-0"
          >
            <div className="absolute inset-0 bg-emerald-600/10 rounded-[28px] blur-3xl transform scale-95 translate-y-4"></div>
            
            {/* Simulator Body */}
            <div className="relative rounded-[28px] border border-neutral-300/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden text-left font-geist">
              
              {/* Simulator Header */}
              <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500 inline-block"></span>
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500 inline-block"></span>
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 inline-block"></span>
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-wider sm:tracking-widest text-neutral-400 dark:text-gray-500 uppercase ml-1 sm:ml-2">Sandbox Simulator</span>
                </div>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-md border border-emerald-500/20">
                  Interactive Demo
                </span>
              </div>

              {/* Dynamic Warning Alert Banner */}
              <AnimatePresence>
                {isBudgetExceeded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-rose-500/10 border-b border-rose-500/20 px-5 py-2.5 flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold"
                  >
                    <FiAlertTriangle className="shrink-0 text-sm animate-bounce" />
                    <span>Warning: Monthly Spend Limit of ₹{simBudgetLimit} Exceeded!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="p-5 space-y-5">
                
                {/* Metric Cards Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-2xl">
                    <span className="text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">Balance</span>
                    <span className="text-sm sm:text-base font-extrabold text-neutral-800 dark:text-white mt-1 block tabular-nums">
                      ₹{simBalance.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="p-3 bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-2xl">
                    <span className="text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">Income</span>
                    <span className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block tabular-nums">
                      +₹{simIncome.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="p-3 bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-2xl">
                    <span className="text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">Expense</span>
                    <span className="text-sm sm:text-base font-extrabold text-rose-600 dark:text-rose-400 mt-1 block tabular-nums">
                      -₹{simExpense.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Budget Limit Tracker */}
                <div className="p-4 bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-2xl">
                  <div className="flex justify-between items-center text-xs font-bold text-neutral-500 dark:text-gray-400 mb-2">
                    <span className="flex items-center gap-1.5">Food & Spend Budget</span>
                    <span>₹{simExpense} / ₹{simBudgetLimit}</span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isBudgetExceeded 
                          ? "bg-gradient-to-r from-rose-500 to-red-500" 
                          : budgetProgressPercent > 80 
                            ? "bg-gradient-to-r from-amber-500 to-orange-500" 
                            : "bg-gradient-to-r from-emerald-500 to-teal-500"
                      }`}
                      style={{ width: `${budgetProgressPercent}%` }}
                    />
                  </div>
                </div>
                {/* Simulator Shorthand Console Input */}
                <form onSubmit={handleSimSubmit} className="space-y-3.5">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Type e.g., Grocery 450 or Rent 1500" 
                      value={simInput}
                      onChange={e => setSimInput(e.target.value)}
                      className="w-full bg-neutral-100 dark:bg-neutral-950 border border-neutral-300/60 dark:border-neutral-800 rounded-xl px-4 py-2.5 pl-10 text-xs font-semibold text-neutral-800 dark:text-white placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
                      autoComplete="off"
                    />
                    <FiCommand className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-400 text-sm" />
                    <button 
                      type="submit" 
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-emerald-600 text-white font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-md hover:bg-emerald-500 transition cursor-pointer"
                    >
                      Parse
                    </button>
                  </div>

                  {/* Preset Command Chips */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[10px] font-bold text-neutral-400 dark:text-gray-500 uppercase tracking-wider mr-1">Quick Add:</span>
                    {commandChips.map((chip) => (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => executeSimCommand(chip.text)}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-neutral-100 dark:bg-white/5 border border-neutral-200/50 dark:border-white/5 text-neutral-600 dark:text-gray-400 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </form>

                {/* Simulated Recent Transactions Feed */}
                <div>
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2.5 flex items-center gap-2">
                    Simulator Feed
                    <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800"></div>
                  </h4>
                  <div className="space-y-2">
                    <AnimatePresence initial={false}>
                      {simTransactions.map((tx) => (
                        <motion.div 
                          key={tx.id}
                          initial={{ opacity: 0, height: 0, scale: 0.95 }}
                          animate={{ opacity: 1, height: "auto", scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-white/[0.01] border border-neutral-200/60 dark:border-neutral-800 rounded-xl"
                        >
                          <div className="flex flex-col text-left">
                            <span className="text-[11px] font-bold text-neutral-800 dark:text-gray-300">{tx.name}</span>
                            <span className="text-[9px] text-neutral-400 font-semibold mt-0.5">{tx.tag}</span>
                          </div>
                          <div className={`text-[11px] font-extrabold flex items-center ${tx.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                            {tx.type === "income" ? <FiArrowUpRight className="mr-0.5 text-xs" /> : <FiArrowDownRight className="mr-0.5 text-xs" />}
                            ₹{tx.amount}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ================= CORE FEATURES GRID ================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-neutral-200 dark:border-neutral-800">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-10"
        >
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-tight">
            Designed for speed. <br/>
            <span className="text-neutral-400 dark:text-gray-500">Built for total financial clarity.</span>
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreFeatures.map((f, i) => (
            <motion.div 
              key={f.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-6 rounded-3xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-left hover:border-neutral-300 dark:hover:border-white/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="p-3 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-white/5 rounded-2xl w-fit mb-5">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-neutral-800 dark:text-white mb-2">{f.title}</h3>
              <p className="text-neutral-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= PREMIUM FOOTER ================= */}
      <footer className="relative z-10 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/30 pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-10">
            
            {/* Branding Column */}
            <div className="md:col-span-5 flex flex-col items-start text-left">
              <div className="flex items-center gap-2 font-serif font-bold text-xl mb-4 text-neutral-800 dark:text-white">
                <div className="w-6 h-6 flex items-center justify-center bg-white rounded-md p-0.5 shadow-sm border border-neutral-200 shrink-0">
                  <img src="/favicon.ico" alt="Spendzy Logo" className="dark:hidden w-full h-full object-contain" />
                  <img src="/favicon.png" alt="Spendzy Logo" className="hidden dark:block w-[90%] h-[90%] object-contain" />
                </div>
                <span>Spend<span className="text-emerald-500">zy</span></span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-gray-400 leading-relaxed max-w-sm">
                Spendzy is a premium, single-pane personal finance tracker engineered for fast logging and visual budgeting. Maintain awareness of your money without the bulk.
              </p>
              <div className="mt-4 flex items-center gap-1.5 px-3 py-1 bg-emerald-500/5 border border-emerald-500/15 rounded-lg text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                <FiShield className="text-sm" />
                <span>SSL Encrypted Database</span>
              </div>
            </div>

            {/* Platform Links Column */}
            <div className="md:col-span-3 flex flex-col items-start text-left">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-4">Platform</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-neutral-500 dark:text-gray-400">
                <li><Link to="/features" className="hover:text-emerald-500 transition-colors">Core Capabilities</Link></li>
                <li><Link to="/customers" className="hover:text-emerald-500 transition-colors">Testimonials & Review</Link></li>
                <li><Link to="/pricing" className="hover:text-emerald-500 transition-colors">Pricing Plans</Link></li>
                <li><Link to="/login" className="hover:text-emerald-500 transition-colors text-left font-semibold">Log In / Register</Link></li>
              </ul>
            </div>

            {/* Security Highlights Column */}
            <div className="md:col-span-4 flex flex-col items-start text-left">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-4">Security Credentials</h4>
              <div className="space-y-3.5">
                <div className="flex gap-2.5 items-start">
                  <FiLock className="text-neutral-400 dark:text-gray-500 text-base mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-neutral-700 dark:text-gray-300">Firebase Protected Auth</span>
                    <span className="text-[10px] text-neutral-400 dark:text-gray-400 leading-relaxed mt-0.5">Sessions are fully sandboxed using secure Google Firebase OAuth.</span>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <FiServer className="text-neutral-400 dark:text-gray-500 text-base mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-neutral-700 dark:text-gray-300">Firestore Document Isolation</span>
                    <span className="text-[10px] text-neutral-400 dark:text-gray-400 leading-relaxed mt-0.5">Custom backend rules ensure only you can query or update your records.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-semibold text-neutral-400 dark:text-gray-500">
            <span>&copy; {new Date().getFullYear()} Spendzy App. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-emerald-500 transition-colors">Contact Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
