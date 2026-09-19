import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { updateProfile, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FiUser, FiSliders, FiShield, FiLogOut } from "react-icons/fi";
import toast from "react-hot-toast";

import { auth, db } from "../../firebase";
import LogoutModal from "../../components/Modal/LogoutModal";

const CURRENCIES = [
  { symbol: "₹", code: "INR" },
  { symbol: "$", code: "USD" },
  { symbol: "€", code: "EUR" },
  { symbol: "£", code: "GBP" },
];

const TABS = [
  { id: "profile", label: "Profile", icon: FiUser },
  { id: "preferences", label: "Preferences", icon: FiSliders },
  { id: "account", label: "Account", icon: FiShield },
];

function getInitials(email) {
  if (!email) return "U";
  return email.substring(0, 2).toUpperCase();
}

export default function SettingsView() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const { currency, updateCurrency } = useOutletContext();

  const [activeTab, setActiveTab] = useState("profile");
  const [displayName, setDisplayName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!displayName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setSavingName(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName.trim(),
      });
      toast.success("Name updated");
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error("Failed to update name");
    } finally {
      setSavingName(false);
    }
  };

  const handleCurrencySelect = async (sym) => {
    if (sym === currency) return;
    updateCurrency(sym);
    if (user?.uid) {
      try {
        await setDoc(
          doc(db, `users/${user.uid}/settings`, "general"),
          { currency: sym },
          { merge: true }
        );
        toast.success(`Currency set to ${sym}`);
      } catch (error) {
        console.error("Error saving currency", error);
        toast.error("Failed to save currency");
      }
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/");
    } catch {
      toast.error("Logout failed");
    } finally {
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6 pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Settings
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        <aside className="md:w-44 shrink-0">
          <nav className="flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer text-left whitespace-nowrap ${
                    isActive
                      ? "bg-neutral-200/70 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-2xs"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/40"
                  }`}
                >
                  <Icon className="text-xs shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 max-w-xl">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Profile
              </h3>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  {getInitials(user?.email)}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 block truncate">
                    {user?.displayName || "Spendzy user"}
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block truncate">
                    {user?.email}
                  </span>
                </div>
              </div>

              <form onSubmit={handleUpdateName} className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block">
                  Display name
                </label>
                <div className="flex gap-2 max-w-md pt-1">
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="flex-1 h-8.5 px-3 bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                  <button
                    type="submit"
                    disabled={savingName || displayName === user?.displayName}
                    className="h-8.5 px-3.5 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-white text-white dark:text-neutral-900 disabled:opacity-40 rounded-xl text-xs font-medium transition cursor-pointer disabled:cursor-not-allowed shrink-0 shadow-2xs"
                  >
                    {savingName ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block">
                  Email address
                </label>
                <div className="max-w-md pt-1">
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full h-8.5 px-3 bg-neutral-100/60 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Preferences
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block">
                  Primary currency
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {CURRENCIES.map((c) => {
                    const isSelected = currency === c.symbol;
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleCurrencySelect(c.symbol)}
                        className={`h-8.5 px-3 rounded-xl border text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-2xs font-semibold"
                            : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        }`}
                      >
                        <span className="font-semibold">{c.symbol}</span>
                        <span className="text-[10px] opacity-70">{c.code}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Account
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block">
                  Active session
                </label>
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="h-8.5 px-3.5 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium transition inline-flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <FiLogOut className="text-xs" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        loading={isLoggingOut}
      />
    </div>
  );
}
