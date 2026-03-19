import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiList, FiTarget, FiSettings, FiLogOut } from 'react-icons/fi';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function Sidebar({ onClose }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch (e) {
      toast.error("Logout failed");
    }
  };

  const navItems = [
    { label: 'Overview', path: '/app', icon: <FiGrid className="text-lg" />, end: true },
    { label: 'Transactions', path: '/app/transactions', icon: <FiList className="text-lg" /> },
    { label: 'Budgets', path: '/app/budgets', icon: <FiTarget className="text-lg" />, disabled: true },
  ];

  return (
    <div className="h-full flex flex-col justify-between py-6 px-4">
      <div>
        <div className="px-4 mb-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-black font-bold shadow-lg">
            S
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Spendzy</span>
        </div>

        <nav className="space-y-1.5 flex flex-col">
          {navItems.map((item) => (
            item.disabled ? (
              <div key={item.label} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 opacity-60 cursor-not-allowed">
                {item.icon}
                <span className="font-medium text-sm">{item.label}</span>
                <span className="ml-auto text-[10px] font-bold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-full border border-white/10">Soon</span>
              </div>
            ) : (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-white/10 text-white border border-white/20 shadow-inner'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                {item.icon}
                <span className="font-medium text-sm">{item.label}</span>
              </NavLink>
            )
          ))}
        </nav>
      </div>

      <div className="space-y-1.5 mt-auto">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition border border-transparent">
          <FiSettings className="text-lg" />
          <span className="font-medium text-sm">Settings</span>
        </button>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 transition border border-transparent">
          <FiLogOut className="text-lg" />
          <span className="font-medium text-sm">Log Out</span>
        </button>
      </div>
    </div>
  );
}
