import { useEffect, useState, Fragment } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { FiX, FiMenu } from "react-icons/fi";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";

import { auth, db } from "../firebase";
import Sidebar from "./Sidebar";
import Logo from "../components/Common/Logo";
import ThemeToggle from "../components/Common/ThemeToggle";
import AddIncome from "../components/Modal/AddIncome";
import AddExpense from "../components/Modal/AddExpense";
import CommandCenterModal from "../components/Modal/CommandCenterModal";

function getInitials(email) {
  if (!email) return "U";
  return email.substring(0, 2).toUpperCase();
}

export default function MainAppLayout() {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("spendzy_currency") || "₹";
  });

  const showIncomeModal = () => setIsIncomeModalVisible(true);
  const showExpenseModal = () => setIsExpenseModalVisible(true);
  const handleIncomeCancel = () => setIsIncomeModalVisible(false);
  const handleExpenseCancel = () => setIsExpenseModalVisible(false);

  useEffect(() => {
    window.openCommandCenter = () => {
      if (user) setIsCommandCenterOpen(true);
    };
    window.openSettingsModal = () => {
      if (user) navigate("/app/settings");
    };
    return () => {
      delete window.openCommandCenter;
      delete window.openSettingsModal;
    };
  }, [user, navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (user) {
          setIsCommandCenterOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (loadingUser || !user?.uid) return;
      setLoading(true);
      try {
        const querySnapshot = await getDocs(
          collection(db, `users/${user.uid}/transactions`)
        );
        const data = querySnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setTransactions(data);

        const settingsSnap = await getDoc(
          doc(db, `users/${user.uid}/settings`, "general")
        );
        if (settingsSnap.exists() && settingsSnap.data().currency) {
          setCurrency(settingsSnap.data().currency);
          localStorage.setItem("spendzy_currency", settingsSnap.data().currency);
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        toast.error("Failed to load user records");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user, loadingUser]);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
    }
  }, [user]);

  const addTransaction = async (transaction, many = false) => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      toast.dismiss();
      const toastId = toast.loading("Adding transaction...");
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      const savedTransaction = { ...transaction, id: docRef.id };
      setTransactions((prev) => [...prev, savedTransaction]);
      toast.dismiss(toastId);
      if (!many) toast.success("Transaction added!");
      setIsExpenseModalVisible(false);
      setIsIncomeModalVisible(false);
    } catch (error) {
      console.error("Error adding transaction", error);
      if (!many) toast.error("Couldn't add transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleFinishModalTransaction = (values, type) => {
    const newTransaction = {
      type,
      date: values.date,
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  const contextValue = {
    transactions,
    addTransaction,
    loading,
    showExpenseModal,
    showIncomeModal,
    currency,
    updateCurrency: (newSymbol) => {
      setCurrency(newSymbol);
      localStorage.setItem("spendzy_currency", newSymbol);
      if (user?.uid) {
        setDoc(
          doc(db, `users/${user.uid}/settings`, "general"),
          { currency: newSymbol },
          { merge: true }
        );
      }
    },
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-neutral-50 dark:bg-neutral-950 overflow-hidden text-neutral-800 dark:text-white relative transition-colors duration-300">
      <AddExpense
        isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancle={handleExpenseCancel}
        onFinish={handleFinishModalTransaction}
      />
      <AddIncome
        isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancle={handleIncomeCancel}
        onFinish={handleFinishModalTransaction}
      />

      <CommandCenterModal
        isOpen={isCommandCenterOpen}
        onClose={() => setIsCommandCenterOpen(false)}
        onAddTransaction={addTransaction}
        currency={currency}
      />

      <header className="md:hidden h-16 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md z-40 transition-colors duration-300">
        <div className="w-11/12 mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 -ml-2 text-neutral-800 dark:text-white hover:bg-neutral-200/50 dark:hover:bg-white/10 rounded-xl transition cursor-pointer"
              aria-label="Open menu"
            >
              <FiMenu className="text-xl" />
            </button>
            <Logo to="/" showName size="w-6 h-6" nameSize="text-base font-bold" />
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/app/settings"
              className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-950 text-xs font-bold shadow-xs cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all"
              title={user?.email ? `${user.email} (Settings)` : "Settings"}
            >
              {getInitials(user?.email)}
            </Link>
          </div>
        </div>
      </header>

      <Transition appear show={isMobileSidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 md:hidden"
          onClose={() => setIsMobileSidebarOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-[260px] flex-1 flex-col shadow-2xl">
                <div className="absolute top-0 right-[-48px] p-2">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-white bg-white/10 hover:bg-white/20 transition cursor-pointer"
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
                <Sidebar onClose={() => setIsMobileSidebarOpen(false)} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <div className="hidden md:flex w-[230px] shrink-0 flex-col z-30 relative">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
        <main className="flex-1 overflow-y-auto relative z-10 px-3.5 sm:px-6 md:px-8 py-4 sm:py-6">
          <div className="w-full max-w-5xl mx-auto pb-10">
            {loading && user ? (
              <div className="flex items-center justify-center p-20 text-neutral-400 text-xs">
                Loading data...
              </div>
            ) : (
              <Outlet context={contextValue} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
