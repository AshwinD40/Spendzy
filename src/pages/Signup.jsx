import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiShield, FiLock, FiCpu } from "react-icons/fi";
import SignupSignin from "../components/SignupSignin";

function Signup() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row lg:overflow-hidden bg-neutral-950 text-white font-sans">
      
      {/* Left visual column (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-neutral-900 border-r border-neutral-800/80 overflow-hidden">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] bg-emerald-500/[0.08] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] bg-blue-500/[0.08] rounded-full blur-[100px] pointer-events-none" />
        
        {/* Top brand identifier */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg p-0.5 shadow-md">
            <img src="/favicon.png" alt="Spendzy Logo" className="w-[85%] h-[85%] object-contain" />
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-50">
            Spend<span className="text-emerald-500">zy</span>
          </span>
        </div>

        {/* Center Animated Image Illustration */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center py-10">
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 1, -1, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 8, 
              ease: "easeInOut" 
            }}
            className="relative w-full max-w-[360px] aspect-square rounded-[36px] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent z-10 pointer-events-none" />
            <img 
              src="/auth_illustration.png" 
              alt="Spendzy Auth Illustration" 
              className="w-full h-full object-cover select-none scale-[1.02]" 
            />
          </motion.div>

          <div className="mt-8 text-center max-w-[340px]">
            <h2 className="text-2xl font-serif font-semibold tracking-tight text-white mb-2 leading-snug">
              Money, finally <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">working for you.</span>
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed font-medium">
              Join thousands of planners and builders using Spendzy to gain total financial clarity with magic CLI-speed commands.
            </p>
          </div>
        </div>

        {/* Bottom trust factors */}
        <div className="relative z-10 flex items-center justify-center gap-6 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
          <span className="flex items-center gap-1.5"><FiShield className="text-xs text-emerald-500" /> AES-256 Encrypted</span>
          <span className="flex items-center gap-1.5"><FiLock className="text-xs text-emerald-500" /> Firebase Auth</span>
        </div>
      </div>

      {/* Right form column */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-4 sm:p-12 bg-neutral-950 relative overflow-x-hidden overflow-y-auto custom-scrollbar">
        {/* Floating background blobs */}
        <div className="absolute top-[20%] left-[30%] w-[300px] h-[300px] bg-emerald-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
        
        {/* Header navigation bar */}
        <div className="flex items-center justify-between w-full z-10 px-2 sm:px-0">
          <Link 
            to="/" 
            className="group flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-900 border border-neutral-800/80 flex items-center justify-center group-hover:bg-neutral-800 group-hover:border-neutral-700 transition duration-300">
              <FiArrowLeft className="text-xs sm:text-sm" />
            </div>
            <span className="hidden sm:inline">Back to Home</span>
          </Link>

          {/* Small responsive brand logo (mobile only) */}
          <div className="lg:hidden flex items-center gap-1.5">
            <div className="w-6 h-6 flex items-center justify-center bg-white rounded-md p-0.5">
              <img src="/favicon.png" alt="Spendzy Logo" className="w-[85%] h-[85%] object-contain" />
            </div>
            <span className="text-sm font-bold tracking-tight text-neutral-50">
              Spend<span className="text-emerald-500">zy</span>
            </span>
          </div>
        </div>

        {/* Center Auth Card */}
        <div className="flex-1 flex items-center justify-center py-6 sm:py-10 w-full z-10">
          <div className="w-full max-w-[400px] p-4 sm:p-10 rounded-[32px] bg-transparent sm:bg-neutral-900 border border-transparent sm:border-neutral-800/80 shadow-none sm:shadow-2xl hover:border-transparent sm:hover:border-neutral-800 transition duration-300">
            <SignupSignin initialLogin={isLogin} />
          </div>
        </div>

        {/* Small footer legal items */}
        <div className="text-center text-[10px] text-neutral-500 font-medium z-10 mt-4">
          By signing up, you agree to our <a href="#" className="underline hover:text-white transition">Terms</a> and <a href="#" className="underline hover:text-white transition">Privacy Policy</a>
        </div>
      </div>
      
    </div>
  );
}

export default Signup;
