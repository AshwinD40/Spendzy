import React, { useState, useEffect, useMemo, Fragment } from "react";
import { useOutletContext } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { db, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiActivity,
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
  FiCoffee,
  FiShoppingCart,
  FiFilm,
  FiZap,
  FiShoppingBag,
  FiTag,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Food",
  "Groceries",
  "Travel",
  "Entertainment",
  "Bills",
  "Shopping",
  "Health",
  "Other",
];

const CATEGORY_ICONS = {
  food: FiCoffee,
  groceries: FiShoppingCart,
  travel: FiActivity,
  entertainment: FiFilm,
  bills: FiZap,
  shopping: FiShoppingBag,
  health: FiActivity,
  other: FiTag,
};

function getDaysRemainingInMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const currentDay = now.getDate();
  return Math.max(1, totalDays - currentDay + 1);
}

export default function BudgetsView() {
  const [user] = useAuthState(auth);
  const { transactions = [], currency = "₹" } = useOutletContext();
  const [budgets, setBudgets] = useState({});
  const [loadingBudgets, setLoadingBudgets] = useState(false);

  // Filter tab state
  const [filterTab, setFilterTab] = useState("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState(CATEGORIES[0]);
  const [modalLimit, setModalLimit] = useState("");
  const [savingBudget, setSavingBudget] = useState(false);

  useEffect(() => {
    const fetchBudgets = async () => {
      if (!user?.uid) return;
      setLoadingBudgets(true);
      try {
        const querySnapshot = await getDocs(
          collection(db, `users/${user.uid}/budgets`)
        );
        const budgetMap = {};
        querySnapshot.forEach((d) => {
          budgetMap[d.id] = d.data().limit;
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

  // Aggregate actual spending by category
  const actualExpensesByCategory = useMemo(() => {
    const totals = {};
    CATEGORIES.forEach((c) => {
      totals[c.toLowerCase()] = 0;
    });

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const tag = (t.tag || "other").toLowerCase().trim();
        if (totals[tag] !== undefined) {
          totals[tag] += Number(t.amount) || 0;
        } else {
          totals["other"] = (totals["other"] || 0) + (Number(t.amount) || 0);
        }
      });

    return totals;
  }, [transactions]);

  // Calculations for overall monthly summary
  const summary = useMemo(() => {
    let totalBudgeted = 0;
    let totalSpentInBudgeted = 0;

    Object.entries(budgets).forEach(([tagKey, limitVal]) => {
      totalBudgeted += Number(limitVal) || 0;
      totalSpentInBudgeted += actualExpensesByCategory[tagKey] || 0;
    });

    const remainingBudget = totalBudgeted - totalSpentInBudgeted;
    const daysRemaining = getDaysRemainingInMonth();
    const dailySafeSpend =
      remainingBudget > 0 ? Math.round(remainingBudget / daysRemaining) : 0;
    const percent =
      totalBudgeted > 0
        ? Math.round((totalSpentInBudgeted / totalBudgeted) * 100)
        : 0;

    return {
      totalBudgeted,
      totalSpentInBudgeted,
      remainingBudget,
      daysRemaining,
      dailySafeSpend,
      percent,
    };
  }, [budgets, actualExpensesByCategory]);

  // Unbudgeted categories that have recorded spending
  const unbudgetedCategories = useMemo(() => {
    return CATEGORIES.filter((c) => {
      const key = c.toLowerCase();
      const spent = actualExpensesByCategory[key] || 0;
      return !budgets[key] && spent > 0;
    });
  }, [budgets, actualExpensesByCategory]);

  // Budget items formatted with status
  const budgetList = useMemo(() => {
    return Object.entries(budgets).map(([tagKey, limitVal]) => {
      const spent = actualExpensesByCategory[tagKey] || 0;
      const percent = limitVal > 0 ? Math.round((spent / limitVal) * 100) : 0;
      const remaining = limitVal - spent;
      const displayName = tagKey.charAt(0).toUpperCase() + tagKey.slice(1);

      let status = "ontrack";
      if (percent >= 100) status = "over";
      else if (percent >= 75) status = "warning";

      return {
        key: tagKey,
        name: displayName,
        limit: limitVal,
        spent,
        percent,
        remaining,
        status,
      };
    });
  }, [budgets, actualExpensesByCategory]);

  // Filtered by tab
  const filteredBudgets = useMemo(() => {
    if (filterTab === "all") return budgetList;
    return budgetList.filter((b) => b.status === filterTab);
  }, [budgetList, filterTab]);

  const counts = useMemo(() => {
    return {
      all: budgetList.length,
      ontrack: budgetList.filter((b) => b.status === "ontrack").length,
      warning: budgetList.filter((b) => b.status === "warning").length,
      over: budgetList.filter((b) => b.status === "over").length,
    };
  }, [budgetList]);

  const openSetModal = (category = CATEGORIES[0], existingLimit = "") => {
    setModalCategory(category);
    setModalLimit(existingLimit ? String(existingLimit) : "");
    setIsModalOpen(true);
  };

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    const limitNum = parseFloat(modalLimit);
    if (isNaN(limitNum) || limitNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const tagKey = modalCategory.toLowerCase();
    setSavingBudget(true);

    try {
      const budgetRef = doc(db, `users/${user.uid}/budgets`, tagKey);
      await setDoc(budgetRef, { limit: limitNum });

      setBudgets((prev) => ({
        ...prev,
        [tagKey]: limitNum,
      }));

      toast.success(
        `Budget set for ${modalCategory}: ${currency}${limitNum.toLocaleString("en-IN")}`
      );
      setIsModalOpen(false);
      setModalLimit("");
    } catch (error) {
      console.error("Error saving budget", error);
      toast.error("Failed to save budget");
    } finally {
      setSavingBudget(false);
    }
  };

  const handleDeleteBudget = async (tagKey) => {
    if (!user?.uid) return;

    try {
      const budgetRef = doc(db, `users/${user.uid}/budgets`, tagKey);
      await deleteDoc(budgetRef);

      setBudgets((prev) => {
        const copy = { ...prev };
        delete copy[tagKey];
        return copy;
      });

      toast.success("Budget removed");
    } catch (error) {
      console.error("Error deleting budget", error);
      toast.error("Failed to remove budget");
    }
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Budgets
        </h1>

        <button
          type="button"
          onClick={() => openSetModal()}
          className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition shadow-2xs active:scale-[0.98] cursor-pointer whitespace-nowrap"
        >
          <FiPlus className="text-xs" />
          <span>Set Budget</span>
        </button>
      </div>

      {/* Monthly Health & Allowance Banner */}
      {summary.totalBudgeted > 0 && (
        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-4 sm:p-6 shadow-2xs space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 block">
                Total Budget
              </span>
              <p className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums mt-0.5">
                {currency}
                {summary.totalBudgeted.toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 block">
                Total Spent
              </span>
              <p className="text-lg sm:text-xl font-bold tracking-tight text-rose-600 dark:text-rose-400 tabular-nums mt-0.5">
                {currency}
                {summary.totalSpentInBudgeted.toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 block">
                Remaining
              </span>
              <p
                className={`text-lg sm:text-xl font-bold tracking-tight tabular-nums mt-0.5 ${
                  summary.remainingBudget >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {summary.remainingBudget >= 0
                  ? `${currency}${summary.remainingBudget.toLocaleString("en-IN")}`
                  : `-${currency}${Math.abs(summary.remainingBudget).toLocaleString("en-IN")}`}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 block">
                Daily Safe Spend
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <p className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {currency}
                  {summary.dailySafeSpend.toLocaleString("en-IN")}
                </p>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  / day ({summary.daysRemaining}d left)
                </span>
              </div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-medium">
              <span className="text-neutral-500 dark:text-neutral-400">
                Monthly Budget Utilization
              </span>
              <span
                className={`font-semibold tabular-nums ${
                  summary.percent >= 100
                    ? "text-rose-600 dark:text-rose-400"
                    : summary.percent >= 75
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {summary.percent}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  summary.percent >= 100
                    ? "bg-rose-500"
                    : summary.percent >= 75
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(summary.percent, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      {budgetList.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setFilterTab("all")}
            className={`h-7 px-3 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              filterTab === "all"
                ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold shadow-2xs"
                : "bg-neutral-100 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            All ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("ontrack")}
            className={`h-7 px-3 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              filterTab === "ontrack"
                ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold shadow-2xs"
                : "bg-neutral-100 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            On Track ({counts.ontrack})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("warning")}
            className={`h-7 px-3 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              filterTab === "warning"
                ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold shadow-2xs"
                : "bg-neutral-100 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            Warning ({counts.warning})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("over")}
            className={`h-7 px-3 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              filterTab === "over"
                ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold shadow-2xs"
                : "bg-neutral-100 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            Over Limit ({counts.over})
          </button>
        </div>
      )}

      {/* Main Budget Cards Grid */}
      {loadingBudgets ? (
        <div className="p-12 text-center text-neutral-400 text-xs">
          Loading budgets...
        </div>
      ) : filteredBudgets.length === 0 && budgetList.length > 0 ? (
        <div className="p-8 text-center text-neutral-400 text-xs rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40">
          No budgets in this status tab.
        </div>
      ) : budgetList.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-8 sm:p-12 text-center shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mx-auto mb-4">
            <FiCheckCircle className="text-2xl" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            No budgets configured yet
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 mb-5 max-w-xs mx-auto">
            Set monthly spending limits for food, bills, travel, and shopping to keep your finances on track.
          </p>
          <button
            type="button"
            onClick={() => openSetModal()}
            className="inline-flex items-center gap-1.5 h-8.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition shadow-xs cursor-pointer"
          >
            <FiPlus className="text-xs" />
            <span>Create your first budget</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredBudgets.map((item) => {
            const Icon = CATEGORY_ICONS[item.key] || FiTag;

            let badgeClasses =
              "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400";
            let badgeLabel = "On track";
            let barColor = "bg-emerald-500";

            if (item.status === "over") {
              badgeClasses =
                "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400";
              badgeLabel = "Over limit";
              barColor = "bg-rose-500";
            } else if (item.status === "warning") {
              badgeClasses =
                "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400";
              badgeLabel = "Near limit";
              barColor = "bg-amber-500";
            }

            return (
              <div
                key={item.key}
                className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-4 shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700 transition flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Icon, Name, Status Badge, Quick Actions */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 shrink-0">
                        <Icon className="text-sm" />
                      </div>
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${badgeClasses}`}
                      >
                        {badgeLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => openSetModal(item.name, item.limit)}
                        className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                        title="Edit limit"
                      >
                        <FiEdit2 className="text-xs" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBudget(item.key)}
                        className="p-1 rounded-lg text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                        title="Delete budget"
                      >
                        <FiTrash2 className="text-xs" />
                      </button>
                    </div>
                  </div>

                  {/* Amounts */}
                  <div className="flex items-baseline justify-between mb-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block">
                        Spent
                      </span>
                      <span className="text-base font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                        {currency}
                        {item.spent.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="text-right space-y-0.5">
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block">
                        Limit
                      </span>
                      <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 tabular-nums">
                        {currency}
                        {item.limit.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${Math.min(item.percent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Footer status text */}
                <div className="flex items-center justify-between text-[11px] pt-1 text-neutral-500 dark:text-neutral-400">
                  <span>{item.percent}% spent</span>
                  <span
                    className={`font-semibold tabular-nums ${
                      item.remaining < 0
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    {item.remaining >= 0
                      ? `${currency}${item.remaining.toLocaleString("en-IN")} left`
                      : `+${currency}${Math.abs(item.remaining).toLocaleString("en-IN")} over`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Unbudgeted Categories Strip */}
      {unbudgetedCategories.length > 0 && (
        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/20 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2.5">
            <FiAlertTriangle className="text-xs text-amber-500 shrink-0" />
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              Unbudgeted Spending Detected
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {unbudgetedCategories.map((cat) => {
              const spent = actualExpensesByCategory[cat.toLowerCase()] || 0;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => openSetModal(cat, spent)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-700 dark:text-neutral-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                >
                  <span className="font-medium">{cat}:</span>
                  <span className="font-bold tabular-nums">
                    {currency}
                    {spent.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 ml-1">
                    + Set
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Set / Edit Budget Dialog */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-xs" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 text-left shadow-2xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      Set Category Budget
                    </Dialog.Title>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                    >
                      <FiX className="text-base" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveBudget} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block">
                        Category
                      </label>
                      <div className="relative">
                        <select
                          value={modalCategory}
                          onChange={(e) => setModalCategory(e.target.value)}
                          className="w-full appearance-none rounded-xl px-3 h-9 bg-neutral-50/50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:border-emerald-500 transition cursor-pointer"
                        >
                          {CATEGORIES.map((c) => (
                            <option
                              key={c}
                              value={c}
                              className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                            >
                              {c}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px]">
                          ▼
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block">
                        Monthly Limit ({currency})
                      </label>
                      <input
                        type="number"
                        step="any"
                        min="1"
                        required
                        placeholder="e.g. 5000"
                        value={modalLimit}
                        onChange={(e) => setModalLimit(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-emerald-500 transition"
                      />
                    </div>

                    {/* Quick presets */}
                    <div className="flex flex-wrap gap-1.5">
                      {[1000, 2500, 5000, 10000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setModalLimit(String(preset))}
                          className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-[11px] font-medium text-neutral-600 dark:text-neutral-300 transition cursor-pointer"
                        >
                          {currency}
                          {preset.toLocaleString("en-IN")}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={savingBudget}
                        className="w-full h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition shadow-xs active:scale-[0.98] cursor-pointer disabled:opacity-50"
                      >
                        {savingBudget ? "Saving..." : "Save Budget"}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
