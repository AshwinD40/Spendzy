import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  FiGrid, 
  FiList, 
  FiTarget, 
  FiSettings, 
  FiLogOut, 
  FiHome, 
  FiTrendingUp, 
  FiUsers, 
  FiDollarSign, 
  FiSearch,
  FiLogIn 
} from 'react-icons/fi';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import toast from 'react-hot-toast';
import ThemeToggle from '../components/Common/ThemeToggle';

export default function Sidebar({ onClose, openAuthModal }) {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/");
      if (onClose) onClose();
    } catch {
      toast.error("Logout failed");
    }
  };

  const getInitials = (email) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  const handleCommandTrigger = () => {
    if (onClose) onClose();
    // Dispatch custom event or call window handler to open Magic Input modal
    if (window.openCommandCenter) {
      window.openCommandCenter();
    } else {
      toast.error("Command Center not initialized");
    }
  };

  const navItems = user 
    ? [
        { label: 'Overview', path: '/app', icon: <FiGrid className="text-sm" />, end: true },
        { label: 'Transactions', path: '/app/transactions', icon: <FiList className="text-sm" /> },
        { label: 'Budgets', path: '/app/budgets', icon: <FiTarget className="text-sm" /> },
      ]
    : [
        { label: 'Home', path: '/', icon: <FiHome className="text-sm" />, end: true },
        { label: 'Features', path: '/features', icon: <FiTrendingUp className="text-sm" /> },
        { label: 'Customers', path: '/customers', icon: <FiUsers className="text-sm" /> },
        { label: 'Pricing', path: '/pricing', icon: <FiDollarSign className="text-sm" /> },
      ];

  return (
    <div className="h-full flex flex-col justify-between py-6 px-4 bg-neutral-50 dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
      
      {/* Top Section */}
      <div>
        {/* Brand Logo & Name & ThemeToggle */}
        <div className="flex items-center justify-between mb-8 px-2">
          <Link 
            to={user ? "/app" : "/"} 
            onClick={(e) => {
              if (onClose) onClose();
              if (!user && window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              <img 
                src="/favicon.ico" 
                alt="Spendzy Logo" 
                className="dark:hidden w-full h-full object-contain bg-white rounded-md p-0.5 transform group-hover:rotate-12 transition-transform duration-300" 
              />
              <img 
                src="/favicon.png" 
                alt="Spendzy Logo" 
                className="hidden dark:block w-[90%] h-[90%] object-contain transform group-hover:rotate-12 transition-transform duration-300" 
              />
            </div>
            <span className="text-lg font-bold font-sans tracking-tight text-neutral-900 dark:text-neutral-50">
              Spend<span className="text-emerald-500">zy</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 flex flex-col">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.end}
              onClick={(e) => {
                if (onClose) onClose();
                if (item.path === '/' && window.location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${isActive
                  ? 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 font-semibold'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-200/20 dark:hover:bg-neutral-800/40'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Quick Search Shortcut Trigger (Only when authenticated) */}
          {user && (
            <button 
              onClick={handleCommandTrigger}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-md transition-all duration-200 bg-neutral-100/30 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800/60 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 text-left w-full cursor-pointer mt-4 whitespace-nowrap"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FiSearch className="text-xs shrink-0" />
                <span className="text-[11px] font-medium truncate">Search...</span>
              </div>
              <kbd className="pointer-events-none inline-flex h-4.5 select-none items-center rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-1.5 font-mono text-[9px] font-bold text-neutral-400 dark:text-neutral-500 shadow-sm shrink-0">
                Ctrl K
              </kbd>
            </button>
          )}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="space-y-4">

        {user ? (
          // Authenticated User Footer
          <div className="space-y-1 border-t border-neutral-200 dark:border-neutral-800/80 pt-4">
            
            {/* User Badge Info */}
            <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg mb-2">
              <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                {getInitials(user.email)}
              </div>
              <div className="flex flex-col text-left overflow-hidden">
                <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-50 truncate">
                  {user.displayName || "My Account"}
                </span>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate leading-none mt-0.5">
                  {user.email}
                </span>
              </div>
            </div>

            <button 
              onClick={() => {
                if (window.openSettingsModal) window.openSettingsModal();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/20 dark:text-neutral-400 dark:hover:text-neutral-50 dark:hover:bg-neutral-800/40 transition text-sm font-medium border border-transparent"
            >
              <FiSettings className="text-base" />
              <span>Settings</span>
            </button>
            
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 transition text-sm font-medium border border-transparent"
            >
              <FiLogOut className="text-base" />
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          // Guest Footer
          <div className="border-t border-neutral-200 dark:border-neutral-800/80 pt-4">
            <Link 
              to="/signup"
              onClick={() => {
                if (onClose) onClose();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-500 font-semibold text-sm transition-all duration-200 shadow-sm active:scale-[0.98]"
            >
              <FiLogIn className="text-base" />
              <span>Log In / Sign Up</span>
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
