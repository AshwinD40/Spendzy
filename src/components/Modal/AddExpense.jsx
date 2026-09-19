import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiX } from "react-icons/fi";
import GlassSelect from "../Common/GlassSelector";

const expenseOptions = [
  { value: "food", label: "Food & Dining" },
  { value: "entertainment", label: "Entertainment" },
  { value: "bills", label: "Bills & Utilities" },
  { value: "shopping", label: "Shopping" },
  { value: "transportation", label: "Transportation" },
  { value: "health", label: "Health & Medical" },
  { value: "other", label: "Other" },
];

export default function AddExpense({
  isExpenseModalVisible,
  handleExpenseCancle,
  onFinish,
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [tag, setTag] = useState("food");

  useEffect(() => {
    if (isExpenseModalVisible) {
      setName("");
      setAmount("");
      setDate(new Date().toISOString().split("T")[0]);
      setTag("food");
    }
  }, [isExpenseModalVisible]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;
    onFinish(
      {
        name: name.trim(),
        amount: parseFloat(amount),
        date: date || new Date().toISOString().split("T")[0],
        tag,
      },
      "expense"
    );
  };

  return (
    <Transition show={isExpenseModalVisible} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={handleExpenseCancle}
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
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
                <div className="flex items-center justify-between mb-5">
                  <Dialog.Title className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Add Expense
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={handleExpenseCancle}
                    className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                    aria-label="Close"
                  >
                    <FiX className="text-base" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Expense Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Groceries, Dinner, etc."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Amount
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-rose-500 transition dark:[color-scheme:dark]"
                    />
                  </div>

                  <GlassSelect
                    label="Category"
                    value={tag}
                    onChange={setTag}
                    options={expenseOptions}
                    accent="rose"
                  />

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full h-9 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition shadow-xs active:scale-[0.98] cursor-pointer"
                    >
                      Save Expense
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
