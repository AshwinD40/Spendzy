import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiX } from "react-icons/fi";
import GlassSelect from "../Common/GlassSelector";

function AddIncome({
  isIncomeModalVisible,
  handleIncomeCancle,
  onFinish
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [tag, setTag] = useState("salary");

  const incomeOptions = [
    { value: "salary", label: "Salary" },
    { value: "freelance", label: "Freelance" },
    { value: "investment", label: "Investment" },
    { value: "papakepaise", label: "Papa Ke Paise" },
    { value: "other", label: "Other" }
  ];

  // Reset form when modal opens
  useEffect(() => {
    if (isIncomeModalVisible) {
      setName("");
      setAmount("");
      setDate("");
      setTag("salary");
    }
  }, [isIncomeModalVisible]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFinish({ name, amount: Number(amount), date, tag }, "income");
  };

  return (
    <Transition show={isIncomeModalVisible} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleIncomeCancle}>
        {/* Backdrop */}
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        {/* Scrollable Container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Modal Panel */}
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[440px] transform overflow-visible rounded-[24px] bg-[#141414e6] backdrop-blur-[28px] border border-white/20 shadow-[0_30px_80px_rgba(0,0,0,0.65),inset_0_0_0_1px_rgba(255,255,255,0.04)] p-6 text-left align-middle transition-all">
                <Dialog.Title as="div" className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-semibold text-white">Add Income</h2>
                    <p className="text-sm text-gray-300">Record money coming in</p>
                  </div>
                  <button type="button" onClick={handleIncomeCancle} className="text-gray-400 hover:text-white transition-colors p-1">
                    <FiX size={24} />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-200 text-sm">Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Salary / Freelance"
                      className="bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-400/60 focus:shadow-[0_0_0_3px_rgba(52,211,153,0.25)] transition-all"
                    />
                  </div>

                  {/* Amount */}
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-200 text-sm">Amount</label>
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="50000"
                      className="bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-400/60 transition-all"
                    />
                  </div>

                  {/* Date */}
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-200 text-sm">Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-400/60 transition-all [color-scheme:dark]"
                    />
                  </div>

                  {/* Tag */}
                  <div className="relative z-[100]">
                    <GlassSelect 
                      label="Category"
                      value={tag}
                      onChange={setTag}
                      options={incomeOptions}
                      accent="emerald"
                    />
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full rounded-xl py-3 font-semibold bg-emerald-500/25 text-emerald-200 border border-emerald-400/30 backdrop-blur-xl transition-all duration-300 hover:bg-emerald-500/35 hover:shadow-[0_12px_45px_rgba(52,211,153,0.35)] hover:scale-[1.02]"
                    >
                      Add Income
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

export default AddIncome;
