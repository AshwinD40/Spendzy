import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FiHome,
  FiGrid,
  FiList,
  FiTarget,
  FiSettings,
  FiSearch,
} from "react-icons/fi";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import ThemeToggle from "../components/Common/ThemeToggle";
import Logo from "../components/Common/Logo";

const navItems = [
  { label: "Home", path: "/", icon: <FiHome className="text-sm" /> },
  { label: "Overview", path: "/app", icon: <FiGrid className="text-sm" />, end: true },
  { label: "Transactions", path: "/app/transactions", icon: <FiList className="text-sm" /> },
  { label: "Budgets", path: "/app/budgets", icon: <FiTarget className="text-sm" /> },
  { label: "Settings", path: "/app/settings", icon: <FiSettings className="text-sm" /> },
];

export default function Sidebar({ onClose }) {
  const [user] = useAuthState(auth);

  const getInitials = (email) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  const handleCommandTrigger = () => {
    if (onClose) onClose();
    if (window.openCommandCenter) {
      window.openCommandCenter();
    } else {
      toast.error("Command Center not initialized");
    }
  };

  return (
    <div className="h-full flex flex-col justify-between py-6 px-4 bg-neutral-50 dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
      <div>
        <div className="flex items-center justify-between mb-8 px-2">
          <Link
            to="/"
            onClick={() => {
              if (onClose) onClose();
            }}
            className="group"
            title="Spendzy Home"
          >
            <Logo
              showName
              size="w-6 h-6"
              imgClassName="transform group-hover:rotate-12 transition-transform duration-300"
            />
          </Link>
          <ThemeToggle />
        </div>

        <nav className="space-y-1 flex flex-col">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.end}
              onClick={() => {
                if (onClose) onClose();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? "bg-neutral-200/60 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 font-semibold"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-200/20 dark:hover:bg-neutral-800/40"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}

          <button
            type="button"
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
        </nav>
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-800/80 pt-4">
        <Link
          to="/app/settings"
          onClick={() => {
            if (onClose) onClose();
          }}
          className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-neutral-200/40 dark:hover:bg-neutral-800/40 transition group"
          title="Account settings"
        >
          <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
            {getInitials(user?.email)}
          </div>
          <div className="flex flex-col text-left overflow-hidden">
            <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-50 truncate group-hover:text-emerald-500 transition-colors">
              {user?.displayName || "My Account"}
            </span>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate leading-none mt-0.5">
              {user?.email}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
