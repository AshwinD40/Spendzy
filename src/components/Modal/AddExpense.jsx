import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiX } from "react-icons/fi";
import GlassSelect from "../Common/GlassSelector";

function AddExpense({
  isExpenseModalVisible,
  handleExpenseCancle,
  onFinish
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [tag, setTag] = useState("food");

  const expenseOptions = [
    { value: "food", label: "Food" },
    { value: "entertainment", label: "Entertainment" },
    { value: "bills", label: "Bills" },
    { value: "shopping", label: "Shopping" },
    { value: "transportation", label: "Transportation" },
    { value: "health", label: "Health" },
    { value: "other", label: "Other" }
  ];

  useEffect(() => {
    if (isExpenseModalVisible) {
      setName("");
      setAmount("");
      setDate("");
      setTag("food");
    }
  }, [isExpenseModalVisible]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFinish({ name, amount: Number(amount), date, tag }, "expense");
  };

  return (
    <Transition show={isExpenseModalVisible} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleExpenseCancle}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[440px] transform overflow-visible rounded-[24px] bg-white dark:bg-[#141414e6] backdrop-blur-[28px] border border-neutral-200 dark:border-white/20 shadow-[0_30px_80px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.65)] p-6 text-left align-middle transition-all">
                <Dialog.Title as="div" className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-semibold text-neutral-800 dark:text-white">Add Expense</h2>
                    <p className="text-sm text-neutral-500 dark:text-gray-300">Track where your money goes</p>
                  </div>
                  <button type="button" onClick={handleExpenseCancle} className="text-neutral-500 dark:text-gray-400 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 rounded-full transition-all duration-150 p-1">
                    <FiX size={24} />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-neutral-600 dark:text-gray-200 text-sm">Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Groceries"
                      className="bg-white dark:bg-white/10 border border-neutral-300 dark:border-white/20 text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-gray-400 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500/60 dark:focus:border-rose-400/60 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.15)] dark:focus:shadow-[0_0_0_3px_rgba(244,63,94,0.25)] transition-all"
                    />
                  </div>

                  {/* Amount */}
                  <div className="flex flex-col gap-2">
                    <label className="text-neutral-600 dark:text-gray-200 text-sm">Amount</label>
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="1200"
                      className="bg-white dark:bg-white/10 border border-neutral-300 dark:border-white/20 text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-gray-400 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500/60 dark:focus:border-rose-400/60 transition-all"
                    />
                  </div>

                  {/* Date */}
                  <div className="flex flex-col gap-2">
                    <label className="text-neutral-600 dark:text-gray-200 text-sm">Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-white dark:bg-white/10 border border-neutral-300 dark:border-white/20 text-neutral-800 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500/60 dark:focus:border-rose-400/60 transition-all dark:[color-scheme:dark]"
                    />
                  </div>

                  {/* Tag */}
                  <div className="relative z-[100]">
                    <GlassSelect 
                      label="Category"
                      value={tag}
                      onChange={setTag}
                      options={expenseOptions}
                      accent="rose"
                    />
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full rounded-xl py-3 font-semibold bg-rose-600 text-white dark:bg-rose-500/25 dark:text-rose-200 border border-rose-600/20 dark:border-rose-400/30 backdrop-blur-xl transition-all duration-300 hover:bg-rose-700 dark:hover:bg-rose-500/35 hover:shadow-[0_12px_45px_rgba(244,63,94,0.15)] dark:hover:shadow-[0_12px_45px_rgba(244,63,94,0.35)] hover:scale-[1.02]"
                    >
                      Add Expense
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

export default AddExpense;
