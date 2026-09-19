import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FiHome, FiGrid, FiAlertTriangle } from "react-icons/fi";

export default function NotFound() {
  const [user] = useAuthState(auth);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-100 h-100 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-112.5 h-112.5 bg-rose-500/5 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '6s' }}></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size[24px_24px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-11/12 max-w-xl mx-auto bg-white/2 border border-white/10 backdrop-blur-xl rounded-4xl p-8 sm:p-12 text-center shadow-2xl"
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-6"
        >
          <FiAlertTriangle className="text-sm animate-bounce" />
          Error Code 404
        </motion.div>

        <div className="relative select-none mb-2">
          <motion.h1 
            initial={{ tracking: "-0.05em", opacity: 0 }}
            animate={{ tracking: "0.02em", opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-8xl sm:text-9xl font-extrabold font-serif tracking-tight leading-none bg-clip-text text-transparent bg-linear-to-b from-white via-neutral-200 to-neutral-600"
          >
            404
          </motion.h1>
          {/* Glowing duplicate behind */}
          <div className="absolute inset-0 text-8xl sm:text-9xl font-extrabold font-serif tracking-tight leading-none bg-clip-text text-transparent bg-linear-to-b from-emerald-500 to-emerald-400 opacity-20 blur-lg select-none pointer-events-none -z-10">
            404
          </div>
        </div>

        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-neutral-200 mb-3"
        >
          Page Not Found
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-neutral-400 text-sm max-w-md mx-auto mb-8 leading-relaxed font-geist"
        >
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. 
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
        >
          {user ? (
            <>
              <Link
                to="/app"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-[0.98]"
              >
                <FiGrid className="text-base" />
                Go to Dashboard
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 font-bold text-sm transition-all"
              >
                <FiHome className="text-base" />
                Return Home
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-[0.98]"
              >
                <FiHome className="text-base" />
                Return to Homepage
              </Link>
              <Link
                to="/signup"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 font-bold text-sm transition-all"
              >
                Get Started Free
              </Link>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
