import React from 'react';
import { FiSearch, FiCommand, FiBell, FiUser, FiMenu } from 'react-icons/fi';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

export default function CommandBar({ onOpenSidebar }) {
  const [user] = useAuthState(auth);

  const getInitials = (name) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-[64px] md:h-[72px] w-full flex items-center justify-between px-4 md:px-10 border-b border-[#222] relative z-20 bg-black">
      
      {/* Mobile Hamburger */}
      <button 
        onClick={onOpenSidebar}
        className="md:hidden p-2 -ml-2 mr-3 text-white hover:bg-white/10 rounded-xl transition"
      >
        <FiMenu className="text-2xl" />
      </button>

      {/* Magic Input (Cmd+K) Placeholder */}
      <div className="flex-1 max-w-lg relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors">
          <FiSearch className="text-lg" />
        </div>
        <input 
          type="text" 
          placeholder='Type "Coffee $5" or search... (Phase 3)' 
          disabled
          className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl pl-12 pr-12 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
          <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-1 text-[10px] font-semibold text-gray-400 bg-white/5 border border-white/10 rounded-md">
            <FiCommand className="mr-0.5" /> K
          </kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-6">
        <button className="p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition relative">
          <FiBell className="text-lg" />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-black" />
        </button>
        
        <div className="h-8 w-px bg-[#333] mx-1 hidden sm:block"></div>

        <button className="flex items-center gap-3 p-1 pl-1.5 pr-3 rounded-full hover:bg-white/5 transition border border-transparent hover:border-white/10 group">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black text-xs font-bold shadow-md ring-2 ring-transparent group-hover:ring-white/20 transition">
             {user?.email ? getInitials(user.email) : <FiUser />}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-medium text-gray-200">{user?.displayName || "My Account"}</span>
            <span className="text-[10px] text-gray-500 leading-none">{user?.email || "Free Plan"}</span>
          </div>
        </button>
      </div>
    </header>
  );
}
