import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FiHome, FiGrid, FiDollarSign, FiArrowLeft, FiAlertTriangle } from "react-icons/fi";

export default function NotFound() {
  const [user] = useAuthState(auth);
  const [coinsCaught, setCoinsCaught] = useState(0);
  const [coinPos, setCoinPos] = useState({ x: 0, y: 0 });
  const [showBlast, setShowBlast] = useState(false);

  // Relocate coin to a random position within limits when clicked
  const handleCoinClick = () => {
    setCoinsCaught((prev) => prev + 1);
    
    // Generate a random position offset
    const randomX = (Math.random() - 0.5) * 260; // range: -130px to 130px
    const randomY = (Math.random() - 0.5) * 160; // range: -80px to 80px
    setCoinPos({ x: randomX, y: randomY });
    
    // Show splash effect
    setShowBlast(true);
    setTimeout(() => setShowBlast(false), 400);
  };

  // Fun helper messages based on coins caught
  const getGameMessage = () => {
    if (coinsCaught === 0) return "Oops! You wandered off the map.";
    if (coinsCaught < 5) return `Nice! You rescued ${coinsCaught} Spendzy Gold ${coinsCaught === 1 ? 'Coin' : 'Coins'}! 🪙`;
    if (coinsCaught < 10) return `${coinsCaught} coins! You're recovering lost funds fast! 🚀`;
    if (coinsCaught < 20) return `Wow! ${coinsCaught} coins! Financial wizard status unlocked! 🧙‍♂️`;
    return `Incredible! ${coinsCaught} coins caught! You should run the bank! 🏦`;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-rose-500/5 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '6s' }}></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Main Card Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xl bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-[32px] p-8 sm:p-12 text-center shadow-2xl"
      >
        {/* Top Warning Badge */}
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-6"
        >
          <FiAlertTriangle className="text-sm animate-bounce" />
          Error Code 404
        </motion.div>

        {/* Huge Animated 404 Text */}
        <div className="relative select-none mb-2">
          <motion.h1 
            initial={{ tracking: "-0.05em", opacity: 0 }}
            animate={{ tracking: "0.02em", opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-8xl sm:text-9xl font-extrabold font-serif tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-200 to-neutral-600"
          >
            404
          </motion.h1>
          {/* Glowing duplicate behind */}
          <div className="absolute inset-0 text-8xl sm:text-9xl font-extrabold font-serif tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-b from-emerald-500 to-emerald-400 opacity-20 blur-lg select-none pointer-events-none -z-10">
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

        {/* Interactive Coin Catcher Mini-Game Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="relative min-h-[220px] w-full bg-neutral-950/60 border border-white/5 rounded-2xl p-6 flex flex-col justify-between overflow-hidden mb-8"
        >
          {/* Game Stats & Message */}
          <div className="z-10">
            <h3 className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 mb-1">Spendzy Coin Rescuer</h3>
            <p className="text-xs text-neutral-400 min-h-[32px] px-4 font-geist">{getGameMessage()}</p>
          </div>

          {/* Interactive Bouncing Coin */}
          <div className="flex-1 w-full flex items-center justify-center relative min-h-[100px]">
            <motion.button
              type="button"
              animate={{ 
                x: coinPos.x, 
                y: coinPos.y,
                scale: showBlast ? [1, 1.3, 1] : [1, 1.08, 1]
              }}
              onClick={handleCoinClick}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
              className="absolute w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 shadow-[0_0_20px_rgba(234,179,8,0.5)] flex items-center justify-center cursor-pointer border border-yellow-300 hover:brightness-110 active:scale-95 select-none z-20"
            >
              <FiDollarSign className="text-xl text-yellow-950 font-extrabold animate-pulse" />
            </motion.button>

            {/* Tap blast effect */}
            <AnimatePresence>
              {showBlast && (
                <motion.div 
                  initial={{ opacity: 0.8, scale: 0.5 }}
                  animate={{ opacity: 0, scale: 2.2 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute w-16 h-16 rounded-full border-2 border-emerald-400 pointer-events-none z-10"
                  style={{ left: `calc(50% + ${coinPos.x - 32}px)`, top: `calc(50% + ${coinPos.y - 32}px)` }}
                />
              )}
            </AnimatePresence>
          </div>

          <span className="text-[10px] text-neutral-500 uppercase tracking-wider select-none">
            Saved: <span className="font-extrabold text-white text-xs">{coinsCaught}</span>
          </span>
        </motion.div>

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
                to="/pricing"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 font-bold text-sm transition-all"
              >
                Explore Premium Plans
              </Link>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
