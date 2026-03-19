import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import CommandBar from './CommandBar';
import AddIncome from '../components/Modal/AddIncome';
import AddExpense from '../components/Modal/AddExpense';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FiX } from 'react-icons/fi';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import toast from 'react-hot-toast';

export default function MainAppLayout() {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const showIncomeModal = () => setIsIncomeModalVisible(true);
  const showExpenseModal = () => setIsExpenseModalVisible(true);
  const handleIncomeCancle = () => setIsIncomeModalVisible(false);
  const handleExpenseCancle = () => setIsExpenseModalVisible(false);

  // Fetch transactions exactly like old Dashboard
  useEffect(() => {
    const fetchTransaction = async () => {
      if(loadingUser || !user?.uid) return;
      setLoading(true);
      try{
        const querySnapshot = await getDocs(collection(db, `users/${user.uid}/transactions`));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTransactions(data);
      } catch(error){
        console.log("Error fetching Transactions", error);
        toast.error("Failed to load Transactions");
      } finally{
        setLoading(false);
      }
    };
    fetchTransaction();
  },[user, loadingUser]);

  const addTransaction = async (transaction, many) => {
    setLoading(true);
    try {
      toast.dismiss();
      const id = toast.loading("Adding Transaction...");
      const docRef = await addDoc(collection(db, `users/${user.uid}/transactions`), transaction);
      const savedTransaction = {...transaction, id: docRef.id};
      setTransactions(prev => [...prev, savedTransaction]);
      toast.dismiss(id);
      if(!many) toast.success("Transaction Added!");
      setIsExpenseModalVisible(false);
      setIsIncomeModalVisible(false);
    } catch (error) {
      console.error("Error adding Document", error);
      if(!many) toast.error("Couldn't add transaction");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date, // now native string format YYYY-MM-DD
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
    showIncomeModal
  };

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden text-white relative">
      {/* Modals are lifted to Layout so they can be opened from anywhere */}
      <AddExpense isExpenseModalVisible={isExpenseModalVisible} handleExpenseCancle={handleExpenseCancle} onFinish={onFinish} />
      <AddIncome isIncomeModalVisible={isIncomeModalVisible} handleIncomeCancle={handleIncomeCancle} onFinish={onFinish} />

      {/* Mobile Sidebar Overlay */}
      <Transition appear show={isMobileSidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={() => setIsMobileSidebarOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
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
              <Dialog.Panel className="relative flex w-full max-w-[260px] flex-1 flex-col bg-black border-r border-[#222] shadow-2xl">
                <div className="absolute top-0 right-[-48px] p-2">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-white bg-white/10 hover:bg-white/20"
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

      {/* Fixed Desktop Sidebar */}
      <div className="hidden md:flex w-[260px] flex-shrink-0 border-r border-[#222] flex-col bg-black z-30 relative">
        <Sidebar />
      </div>

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col h-screen relative overflow-hidden bg-black">
        {/* Global Nav / Search */}
        <CommandBar onOpenSidebar={() => setIsMobileSidebarOpen(true)} />

        {/* Dynamic Nested Routes Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10 p-4 sm:p-6 md:p-10">
          <div className="max-w-[1200px] mx-auto w-full pb-20">
            {loading ? (
              <div className="flex items-center justify-center p-20 text-gray-400">Loading data...</div>
            ) : (
              <Outlet context={contextValue} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
