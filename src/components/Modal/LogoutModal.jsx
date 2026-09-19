import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiLogOut } from "react-icons/fi";

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 text-left align-middle shadow-2xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <FiLogOut className="text-base" />
                  </div>
                  <Dialog.Title className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Log out of Spendzy?
                  </Dialog.Title>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                  Are you sure you want to log out? You will need to sign in again to access your dashboard.
                </p>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-3.5 h-8.5 rounded-xl text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onConfirm}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-3.5 h-8.5 rounded-xl text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 shadow-xs transition cursor-pointer disabled:opacity-50 active:scale-[0.98]"
                  >
                    <FiLogOut className="text-xs" />
                    <span>Log out</span>
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
