import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiX, FiZap, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";

function parseCommand(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const tokens = trimmed.split(/\s+/);
  if (tokens.length < 2) return null;

  const lastToken = tokens[tokens.length - 1];
  const amountClean = lastToken.replace(/[^\d.]/g, "");
  const amountNum = parseFloat(amountClean);

  if (isNaN(amountNum) || amountNum <= 0) return null;

  const name = tokens.slice(0, -1).join(" ");
  const nameLower = name.toLowerCase();

  let type = "expense";
  if (
    nameLower.includes("salary") ||
    nameLower.includes("freelance") ||
    nameLower.includes("income") ||
    nameLower.includes("dividend") ||
    nameLower.includes("bonus") ||
    nameLower.includes("refund") ||
    nameLower.includes("interest")
  ) {
    type = "income";
  }

  let tag = "Other";
  if (
    nameLower.includes("lunch") ||
    nameLower.includes("dinner") ||
    nameLower.includes("coffee") ||
    nameLower.includes("breakfast") ||
    nameLower.includes("food") ||
    nameLower.includes("restaurant") ||
    nameLower.includes("sushi") ||
    nameLower.includes("pizza") ||
    nameLower.includes("grocery") ||
    nameLower.includes("groceries")
  ) {
    tag = "Food";
  } else if (
    nameLower.includes("uber") ||
    nameLower.includes("taxi") ||
    nameLower.includes("bus") ||
    nameLower.includes("metro") ||
    nameLower.includes("flight") ||
    nameLower.includes("train") ||
    nameLower.includes("fuel") ||
    nameLower.includes("gas") ||
    nameLower.includes("travel")
  ) {
    tag = "Travel";
  } else if (
    nameLower.includes("netflix") ||
    nameLower.includes("spotify") ||
    nameLower.includes("movie") ||
    nameLower.includes("game") ||
    nameLower.includes("entertainment") ||
    nameLower.includes("cinema")
  ) {
    tag = "Entertainment";
  } else if (
    nameLower.includes("rent") ||
    nameLower.includes("electricity") ||
    nameLower.includes("phone") ||
    nameLower.includes("water") ||
    nameLower.includes("bill") ||
    nameLower.includes("wifi") ||
    nameLower.includes("internet")
  ) {
    tag = "Bills";
  } else if (
    nameLower.includes("amazon") ||
    nameLower.includes("cloth") ||
    nameLower.includes("clothes") ||
    nameLower.includes("shoe") ||
    nameLower.includes("shoes") ||
    nameLower.includes("shopping") ||
    nameLower.includes("mall")
  ) {
    tag = "Shopping";
  } else if (
    nameLower.includes("doctor") ||
    nameLower.includes("medicine") ||
    nameLower.includes("pharmacy") ||
    nameLower.includes("hospital") ||
    nameLower.includes("health")
  ) {
    tag = "Health";
  }

  return {
    name,
    amount: amountNum,
    type,
    tag,
    date: new Date().toISOString().split("T")[0],
  };
}

export default function CommandCenterModal({
  isOpen,
  onClose,
  onAddTransaction,
  currency = "₹",
}) {
  const [commandText, setCommandText] = useState("");

  const parsedCommandObj = parseCommand(commandText);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!parsedCommandObj) {
      toast.error("Please provide valid format (e.g. Coffee 120)");
      return;
    }

    try {
      await onAddTransaction(parsedCommandObj);
      setCommandText("");
      onClose();
    } catch {
      toast.error("Failed to add transaction");
    }
  };

  const handleClose = () => {
    setCommandText("");
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-xs transition-opacity" />
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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 text-left shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <FiZap className="text-sm" />
                    </div>
                    <Dialog.Title className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      Command Center
                    </Dialog.Title>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                  >
                    <FiX className="text-base" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm pointer-events-none" />
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder='Type e.g. "Dinner 450" or "Salary 8000"'
                      value={commandText}
                      onChange={(e) => setCommandText(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-all font-sans"
                    />
                  </div>

                  <div className="p-3 bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/70 dark:border-neutral-800 rounded-xl min-h-14 flex flex-col justify-center">
                    {parsedCommandObj ? (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] text-neutral-400">
                            Parsed
                          </span>
                          <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                            {parsedCommandObj.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                            {parsedCommandObj.tag}
                          </span>
                          <span
                            className={`text-xs font-semibold tabular-nums ${
                              parsedCommandObj.type === "income"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {parsedCommandObj.type === "income" ? "+" : "-"}
                            {currency}
                            {parsedCommandObj.amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 text-center">
                        Format: <span className="font-medium text-neutral-600 dark:text-neutral-300">"Description [space] Amount"</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!parsedCommandObj}
                    className="w-full h-9 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl font-medium text-xs transition-all shadow-xs active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed"
                  >
                    Add transaction
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
