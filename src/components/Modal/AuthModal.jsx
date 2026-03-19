import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FiX } from 'react-icons/fi';
import SignupSignin from '../SignupSignin';

export default function AuthModal({ isOpen, onClose }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-400"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md relative">
                  <div className="absolute inset-0 bg-[#0a0a0a] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-y-auto custom-scrollbar border-l border-white/10">
                    <div className="flex flex-col min-h-full p-6 sm:p-8">
                      <div className="flex items-center justify-end mb-4">
                        <button
                          type="button"
                          className="rounded-full p-2 text-gray-400 hover:text-white hover:bg-white/10 transition z-10"
                          onClick={onClose}
                        >
                          <FiX className="h-6 w-6" />
                        </button>
                      </div>

                      <div className="flex-1 flex flex-col justify-center w-full">
                        <SignupSignin />
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
