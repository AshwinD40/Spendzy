import { useState } from "react";
import { motion } from "framer-motion";
import PlaygroundWidget from "../components/PlaygroundWidget";
import AuthModal from "../components/Modal/AuthModal";
import { FiArrowRight, FiCommand, FiShield, FiPieChart, FiLayout, FiZap } from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white selection:bg-emerald-500/30">
      
      {/* Deep Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
      </div>

      {/* ================= INLINED NAVBAR ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-6 py-2 pointer-events-none">
        <div className="mx-auto w-full max-w-6xl flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-2 rounded-[20px] sm:rounded-3xl pointer-events-auto bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {/* Logo */}
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="flex items-center gap-1.5 sm:gap-2 text-lg sm:text-xl font-bold tracking-tight text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-[10px] sm:rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xs sm:text-base font-bold shadow-lg">S</div>
            Spend<span className="text-emerald-400">zy</span>
          </button>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#customers" className="hover:text-white transition-colors">Customers</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button onClick={() => setIsAuthModalOpen(true)} className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white transition-colors">Log in</button>
            <button onClick={() => setIsAuthModalOpen(true)} className="group flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-emerald-600 text-white text-xs sm:text-sm font-bold hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/50">
              <span className="hidden sm:inline">Get started</span><span className="sm:hidden">Start</span><FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION (Split Screen) ================= */}
      <section className="relative z-10 min-h-[85vh] md:min-h-[90vh] flex items-center pt-24 sm:pt-28 pb-8 sm:pb-16">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-5 lg:gap-8 items-center mt-2 sm:mt-0">
          
          {/* Left: Typography Hook */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start text-left max-w-2xl"
          >
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Spendzy 2.0 is live
            </motion.div>

            <motion.h1 
              variants={fadeUp}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.15] sm:leading-[1.1]"
            >
              Money, finally <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-green-300">
                working for you.
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeUp}
              className="mt-4 sm:mt-6 text-base sm:text-xl text-gray-400 leading-relaxed max-w-xl"
            >
              The ultimate single-pane command center. 
              Ditch the spreadsheets and track your cash flow instantly.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full sm:w-auto group flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-emerald-600 text-white font-bold text-base sm:text-lg hover:bg-emerald-500 transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] ring-1 ring-emerald-400/50"
              >
                Start tracking free
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center justify-center gap-2 px-2 py-2 text-xs sm:text-sm text-gray-500 font-medium">
                <FiShield className="text-gray-400 text-base" />
                No tracking. No ads.
              </div>
            </motion.div>
          </motion.div>

          {/* Right: The Interactive Playground Hero */}
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
            className="relative w-full max-w-[340px] mx-auto lg:mr-0 lg:ml-auto mt-6 lg:mt-0"
          >
            {/* Solid vibrant backdrop shadow instead of vague blur */}
            <div className="absolute inset-0 bg-emerald-600/20 rounded-[24px] sm:rounded-[32px] blur-xl sm:blur-2xl transform scale-95 translate-y-2 sm:translate-y-4"></div>
            
            <div className="relative rounded-[24px] sm:rounded-[32px] ring-1 ring-[#333] shadow-2xl overflow-hidden bg-[#111] transform hover:-translate-y-1 transition-transform duration-500">
              <PlaygroundWidget />
            </div>
          </motion.div>

        </div>
      </section>


      {/* ================= BENTO BOX SECTION ================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32 border-t border-white/5">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-10 sm:mb-16"
        >
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight">Everything you need.<br/><span className="text-gray-500">Nothing you don't.</span></motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 sm:gap-6 auto-rows-[220px] sm:auto-rows-[280px]">
          
          {/* Bento 1: Large Span - Command Center */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }} transition={{ duration: 0.5 }}
            className="md:col-span-2 md:row-span-2 rounded-[24px] sm:rounded-[32px] bg-[#111] border border-[#222] p-6 sm:p-8 flex flex-col relative overflow-hidden group hover:border-[#444] transition-colors"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors duration-700"></div>
            <div className="relative z-10 flex-1 flex flex-col justify-end h-full">
              <div className="mb-auto p-3 sm:p-4 bg-black border border-[#333] rounded-[14px] sm:rounded-2xl w-fit shadow-lg">
                <FiLayout className="text-2xl sm:text-3xl text-emerald-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-2 sm:mb-3">Single-Pane Command Center</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">No bouncing between pages. Everything happens in one instantly-responsive app window.</p>
            </div>
            
            {/* Visual element bleeding off the edge */}
            <div className="hidden sm:flex absolute right-[-40px] top-[40px] w-64 h-48 bg-black/50 border border-white/10 rounded-xl shadow-2xl flex-col p-3 gap-2 opacity-50 group-hover:opacity-100 transition-opacity duration-500 rotate-3 group-hover:rotate-0">
               <div className="w-full h-8 bg-white/5 rounded-md flex items-center px-3"><span className="w-4 h-4 bg-rose-400 rounded-sm"></span></div>
               <div className="w-3/4 h-8 bg-white/5 rounded-md flex items-center px-3"><span className="w-4 h-4 bg-emerald-400 rounded-sm"></span></div>
               <div className="w-5/6 h-8 bg-white/5 rounded-md flex items-center px-3"><span className="w-4 h-4 bg-teal-400 rounded-sm"></span></div>
            </div>
          </motion.div>

          {/* Bento 2: Standard Box - Magic Input */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2 rounded-[24px] sm:rounded-[32px] bg-[#111] border border-[#222] p-6 sm:p-8 flex flex-col justify-end overflow-hidden relative group hover:border-[#444] transition-colors"
          >
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <kbd className="px-2 py-1 sm:px-3 sm:py-1.5 bg-black border border-[#333] rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold font-mono text-gray-300 shadow-inner flex items-center gap-1"><FiCommand/>K</kbd>
                <span className="text-emerald-500 text-[10px] sm:text-xs font-bold tracking-widest uppercase">Coming Soon</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">Magic Input</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Hit Cmd+K, type "Sushi 45", hit Enter. We do the rest.</p>
            </div>
          </motion.div>

          {/* Bento 3: Small Box - Analytics */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-[24px] sm:rounded-[32px] bg-[#111] border border-[#222] hover:border-[#444] transition-colors p-6 sm:p-8 flex flex-col items-center justify-center text-center relative group"
          >
            <FiPieChart className="text-4xl sm:text-5xl text-purple-500 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">Deep Analytics</h3>
            <p className="text-gray-400 text-[10px] sm:text-xs">Spot trends securely over time.</p>
          </motion.div>

          {/* Bento 4: Small Box - Lightning Fast */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }} transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-[24px] sm:rounded-[32px] bg-[#111] border border-[#222] hover:border-[#444] transition-colors p-6 sm:p-8 flex flex-col items-center justify-center text-center relative group"
          >
            <FiZap className="text-4xl sm:text-5xl text-yellow-500 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">Lightning Fast</h3>
            <p className="text-gray-400 text-[10px] sm:text-xs">No full page reloads. Ever.</p>
          </motion.div>

        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 py-24 sm:py-40 text-center flex flex-col items-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 sm:mb-6"
        >
          Ready to take control?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="text-gray-400 text-base sm:text-xl mb-8 sm:mb-10 max-w-sm sm:max-w-lg"
        >
          Join Spendzy today. Set it up in 60 seconds, and never look back.
        </motion.p>
        <motion.button 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          onClick={() => setIsAuthModalOpen(true)}
          className="px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-emerald-600 text-white font-bold text-base sm:text-lg hover:bg-emerald-500 transition-all shadow-xl hover:scale-105 w-full sm:w-auto"
        >
          Get started for free
        </motion.button>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
