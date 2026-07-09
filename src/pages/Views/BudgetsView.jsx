import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { db, auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { FiPlus, FiTrash2, FiAlertCircle, FiCheckCircle, FiActivity } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CATEGORIES = ["Food", "Groceries", "Travel", "Entertainment", "Bills", "Shopping", "Other"];

export default function BudgetsView() {
  const [user] = useAuthState(auth);
  const { transactions, currency } = useOutletContext();
  const [budgets, setBudgets] = useState({});
  const [loadingBudgets, setLoadingBudgets] = useState(false);

  // Form states
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [limit, setLimit] = useState("");

  // Fetch budgets from Firestore
  useEffect(() => {
    const fetchBudgets = async () => {
      if (!user?.uid) return;
      setLoadingBudgets(true);
      try {
        const querySnapshot = await getDocs(collection(db, `users/${user.uid}/budgets`));
        const budgetMap = {};
        querySnapshot.forEach(doc => {
          budgetMap[doc.id] = doc.data().limit;
        });
        setBudgets(budgetMap);
      } catch (error) {
        console.error("Error fetching budgets", error);
        toast.error("Failed to load budgets");
      } finally {
        setLoadingBudgets(false);
      }
    };

    fetchBudgets();
  }, [user]);

  // Group actual expenses from current month/transactions
  const actualExpensesByCategory = useMemo(() => {
    const totals = {};
    
    // Default all categories to 0
    CATEGORIES.forEach(c => {
      totals[c.toLowerCase()] = 0;
    });

    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const tag = (t.tag || 'other').toLowerCase().trim();
        if (totals[tag] !== undefined) {
          totals[tag] += Number(t.amount);
        } else {
          totals['other'] = (totals['other'] || 0) + Number(t.amount);
        }
      });

    return totals;
  }, [transactions]);

  // Handle saving budget
  const handleSaveBudget = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    if (!limit || Number(limit) <= 0) {
      toast.error("Please enter a valid budget limit");
      return;
    }

    const tagKey = selectedCategory.toLowerCase();
    const limitNum = parseFloat(limit);

    try {
      const budgetRef = doc(db, `users/${user.uid}/budgets`, tagKey);
      await setDoc(budgetRef, { limit: limitNum });
      
      setBudgets(prev => ({
        ...prev,
        [tagKey]: limitNum
      }));

      toast.success(`Set budget for ${selectedCategory} to ${currency}${limitNum.toLocaleString('en-IN')}`);
      setLimit("");
    } catch (error) {
      console.error("Error saving budget", error);
      toast.error("Failed to save budget");
    }
  };

  // Handle resetting/deleting budget
  const handleDeleteBudget = async (tagKey) => {
    if (!user?.uid) return;

    try {
      const budgetRef = doc(db, `users/${user.uid}/budgets`, tagKey);
      await deleteDoc(budgetRef);

      setBudgets(prev => {
        const copy = { ...prev };
        delete copy[tagKey];
        return copy;
      });

      toast.success("Budget limit reset successfully");
    } catch (error) {
      console.error("Error resetting budget", error);
      toast.error("Failed to reset budget");
    }
  };

  // Total summary of all active budgets vs corresponding spending
  const summary = useMemo(() => {
    let totalBudgeted = 0;
    let totalSpentInBudgeted = 0;

    Object.entries(budgets).forEach(([tagKey, limitVal]) => {
      totalBudgeted += limitVal;
      totalSpentInBudgeted += actualExpensesByCategory[tagKey] || 0;
    });

    return {
      totalBudgeted,
      totalSpentInBudgeted,
      percent: totalBudgeted > 0 ? Math.round((totalSpentInBudgeted / totalBudgeted) * 100) : 0
    };
  }, [budgets, actualExpensesByCategory]);

  return (
    <div className="space-y-6 pb-10">
      
      {/* Top Title Banner */}
      <div>
        <h1 className="text-xl md:text-2xl font-serif font-bold text-neutral-800 dark:text-white mb-1">Budgets</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-xs">Monitor your monthly limits and visual progress against category expenses.</p>
      </div>

      {/* Main Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left/Middle Columns: Active Category Budgets in a Single unified Card */}
        <div className="lg:col-span-2 space-y-4">
          
          {loadingBudgets ? (
            <div className="p-8 text-center text-neutral-400">Loading budgets...</div>
          ) : Object.keys(budgets).length === 0 ? (
            <div className="bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl p-8 text-center text-neutral-500 dark:text-neutral-400 shadow-sm">
              <FiCheckCircle className="mx-auto text-2xl text-neutral-300 dark:text-neutral-700 mb-2" />
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">No budgets set yet.</p>
              <p className="text-xs mt-1 text-neutral-400 dark:text-neutral-500">Use the budget manager on the right to set monthly category targets.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl p-5 shadow-sm dark:shadow-none transition-all duration-300">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
                Category Budgets
              </h3>
              
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                {Object.entries(budgets).map(([tagKey, limitVal]) => {
                  const spent = actualExpensesByCategory[tagKey] || 0;
                  const percent = limitVal > 0 ? Math.round((spent / limitVal) * 100) : 0;
                  const displayName = tagKey.charAt(0).toUpperCase() + tagKey.slice(1);
                  
                  // Style colors based on percentage
                  let barColor = "bg-emerald-500";
                  let badgeStyle = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
                  
                  if (percent >= 100) {
                    barColor = "bg-rose-500";
                    badgeStyle = "bg-rose-500/10 text-rose-600 dark:text-rose-400";
                  } else if (percent >= 75) {
                    barColor = "bg-amber-500";
                    badgeStyle = "bg-amber-500/10 text-amber-600 dark:text-amber-400";
                  }

                  return (
                    <div key={tagKey} className="py-4 first:pt-0 last:pb-0 flex flex-col gap-2 font-sans">
                      
                      {/* Row Header: Name & Progress pill badge (left), Numbers & Delete (right) */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 capitalize">
                            {displayName}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${badgeStyle}`}>
                            {percent}% spent
                          </span>
                          {percent >= 100 && (
                            <span className="text-[9px] text-rose-500 font-extrabold uppercase tracking-wider animate-pulse">
                              Over Limit!
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-geist">
                            <span className="font-bold text-neutral-800 dark:text-white">{currency}{spent.toLocaleString('en-IN')}</span>
                            <span className="mx-1 text-neutral-300 dark:text-neutral-800">/</span>
                            <span className="text-neutral-400 dark:text-neutral-500">{currency}{limitVal.toLocaleString('en-IN')}</span>
                          </span>
                          <button 
                            onClick={() => handleDeleteBudget(tagKey)}
                            className="p-1 text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400 rounded transition cursor-pointer"
                            title="Reset Budget"
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Sleek modern 5px progress bar */}
                      <div className="w-full bg-neutral-100 dark:bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${barColor}`} 
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Manage Budget Form & Total Summary */}
        <div className="space-y-4">
          
          {/* Manage Form */}
          <div className="bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">Set Budget Limit</h3>
            
            <form onSubmit={handleSaveBudget} className="space-y-4">
              
              {/* Dropdown tag */}
              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold">Select Category</label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full appearance-none rounded-lg px-3 py-2 bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-neutral-200 text-xs focus:outline-none focus:border-emerald-500 transition cursor-pointer"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">{cat}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px]">
                    ▼
                  </span>
                </div>
              </div>

              {/* Amount input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold">Monthly Limit ({currency})</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold">{currency}</span>
                  <input
                    type="number"
                    required
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    placeholder="E.g. 15000"
                    className="w-full pl-7 pr-3 py-2 bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-lg text-neutral-800 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition font-geist"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-600 text-white rounded-md font-semibold text-xs hover:bg-emerald-500 transition shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <FiPlus className="text-sm" />
                <span>Save Category Budget</span>
              </button>
            </form>
          </div>

          {/* Budget Summary Card */}
          {summary.totalBudgeted > 0 && (
            <div className="bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                  <FiActivity className="text-sm" />
                </div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Budget Summary</h4>
              </div>

              <div className="space-y-2.5 font-geist">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-neutral-500 dark:text-neutral-400">Total Budgeted</span>
                  <span className="font-bold text-neutral-800 dark:text-white">{currency}{summary.totalBudgeted.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-neutral-500 dark:text-neutral-400">Total spent in categories</span>
                  <span className="font-bold text-neutral-800 dark:text-white">{currency}{summary.totalSpentInBudgeted.toLocaleString('en-IN')}</span>
                </div>

                <hr className="border-neutral-100 dark:border-neutral-800/80" />

                <div className="flex justify-between text-xs font-bold">
                  <span className="text-neutral-500 dark:text-neutral-400">Aggregated Progress</span>
                  <span className={summary.percent >= 100 ? "text-rose-500 animate-pulse" : summary.percent >= 75 ? "text-amber-500" : "text-emerald-500"}>
                    {summary.percent}%
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
