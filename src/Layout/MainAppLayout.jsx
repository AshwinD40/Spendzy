import { useEffect, useState, Fragment } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import AddIncome from '../components/Modal/AddIncome';
import AddExpense from '../components/Modal/AddExpense';
import AuthModal from '../components/Modal/AuthModal';
import ThemeToggle from '../components/Common/ThemeToggle';
import { Dialog, Transition } from '@headlessui/react';
import { FiX, FiMenu, FiUser, FiZap, FiSearch, FiSettings } from 'react-icons/fi';
import { addDoc, collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { updateProfile } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function MainAppLayout() {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
  const [commandText, setCommandText] = useState("");
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsName, setSettingsName] = useState("");
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('spendzy_currency') || '₹';
  });

  const showIncomeModal = () => setIsIncomeModalVisible(true);
  const showExpenseModal = () => setIsExpenseModalVisible(true);
  const handleIncomeCancle = () => setIsIncomeModalVisible(false);
  const handleExpenseCancle = () => setIsExpenseModalVisible(false);

  useEffect(() => {
    window.openCommandCenter = () => {
      if (user) setIsCommandCenterOpen(true);
    };
    window.openSettingsModal = () => {
      if (user) {
        setSettingsName(user.displayName || "");
        setIsSettingsModalOpen(true);
      }
    };
    return () => {
      delete window.openCommandCenter;
      delete window.openSettingsModal;
    };
  }, [user]);

  // Keyboard shortcut listener Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (user) {
          setIsCommandCenterOpen(prev => !prev);
        } else {
          setIsAuthModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user]);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (loadingUser || !user?.uid) return;
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, `users/${user.uid}/transactions`));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTransactions(data);

        const settingsSnap = await getDoc(doc(db, `users/${user.uid}/settings`, 'general'));
        if (settingsSnap.exists() && settingsSnap.data().currency) {
          setCurrency(settingsSnap.data().currency);
          localStorage.setItem('spendzy_currency', settingsSnap.data().currency);
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        toast.error("Failed to load user records");
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [user, loadingUser]);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
    }
  }, [user]);

  const addTransaction = async (transaction, many) => {
    setLoading(true);
    try {
      toast.dismiss();
      const id = toast.loading("Adding Transaction...");
      const docRef = await addDoc(collection(db, `users/${user.uid}/transactions`), transaction);
      const savedTransaction = { ...transaction, id: docRef.id };
      setTransactions(prev => [...prev, savedTransaction]);
      toast.dismiss(id);
      if (!many) toast.success("Transaction Added!");
      setIsExpenseModalVisible(false);
      setIsIncomeModalVisible(false);
    } catch (error) {
      console.error("Error adding Document", error);
      if (!many) toast.error("Couldn't add transaction");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date, // native string format YYYY-MM-DD
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  const getInitials = (email) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  const parseCommand = (input) => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    
    const tokens = trimmed.split(/\s+/);
    if (tokens.length < 2) return null;
    
    const lastToken = tokens[tokens.length - 1];
    const amountClean = lastToken.replace(/[^\d.]/g, '');
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
      nameLower.includes("dress") || 
      nameLower.includes("shoes") || 
      nameLower.includes("amazon") || 
      nameLower.includes("shopping") || 
      nameLower.includes("shirt")
    ) {
      tag = "Shopping";
    }
    
    return {
      name,
      amount: amountNum,
      type,
      tag,
      date: new Date().toISOString().split('T')[0]
    };
  };

  const parsedCommandObj = parseCommand(commandText);

  const handleExecuteCommand = (e) => {
    e.preventDefault();
    if (!parsedCommandObj) {
      toast.error("Please enter a valid command format (e.g. Sushi 450)");
      return;
    }
    addTransaction(parsedCommandObj);
    setCommandText("");
    setIsCommandCenterOpen(false);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    
    try {
      toast.loading("Saving profile settings...");
      if (settingsName !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName: settingsName });
      }

      await setDoc(doc(db, `users/${user.uid}/settings`, 'general'), { currency }, { merge: true });
      localStorage.setItem('spendzy_currency', currency);

      toast.dismiss();
      toast.success("Settings updated!");
      setIsSettingsModalOpen(false);
    } catch (error) {
      console.error("Error updating settings", error);
      toast.dismiss();
      toast.error("Failed to update settings");
    }
  };

  const contextValue = {
    transactions,
    addTransaction,
    loading,
    showExpenseModal,
    showIncomeModal,
    openAuthModal: () => setIsAuthModalOpen(true),
    currency,
    updateCurrency: (newSymbol) => {
      setCurrency(newSymbol);
      localStorage.setItem('spendzy_currency', newSymbol);
      if (user?.uid) {
        setDoc(doc(db, `users/${user.uid}/settings`, 'general'), { currency: newSymbol }, { merge: true });
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-neutral-50 dark:bg-neutral-950 overflow-hidden text-neutral-800 dark:text-white relative transition-colors duration-300">
      
      <AddExpense isExpenseModalVisible={isExpenseModalVisible} handleExpenseCancle={handleExpenseCancle} onFinish={onFinish} />
      <AddIncome isIncomeModalVisible={isIncomeModalVisible} handleIncomeCancle={handleIncomeCancle} onFinish={onFinish} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <Transition appear show={isCommandCenterOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsCommandCenterOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-md" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[500px] transform overflow-hidden rounded-2xl bg-white dark:bg-[#141414e6] border border-neutral-200 dark:border-white/10 p-6 text-left shadow-2xl transition-all">
                <Dialog.Title as="div" className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                      <FiZap className="text-emerald-500 text-lg" />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-800 dark:text-white">Command Center</h3>
                      <p className="text-[11px] text-neutral-400 dark:text-gray-500">Quick-log transactions using shorthand command parser</p>
                    </div>
                  </div>
                  <button onClick={() => setIsCommandCenterOpen(false)} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition">
                    <FiX size={20} />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleExecuteCommand} className="space-y-4 mt-2">
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input 
                      type="text"
                      required
                      autoFocus
                      placeholder='Type "Dinner 450" or "Salary 8000"'
                      value={commandText}
                      onChange={e => setCommandText(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-geist"
                    />
                  </div>

                  {/* Real-time Category guessing preview */}
                  <div className="p-4 bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/50 dark:border-white/5 rounded-xl min-h-[76px] flex flex-col justify-center">
                    {parsedCommandObj ? (
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Parsed Transaction</span>
                          <span className="text-sm font-bold text-neutral-800 dark:text-white mt-0.5">{parsedCommandObj.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-200/50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                            {parsedCommandObj.tag}
                          </span>
                          <span className={`text-sm font-extrabold ${parsedCommandObj.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {parsedCommandObj.type === 'income' ? 'Income' : 'Expense'}: {currency}{parsedCommandObj.amount}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400 dark:text-gray-500 italic text-center">
                        Format: <span className="font-semibold not-italic text-neutral-600 dark:text-gray-300">"Description [space] Amount"</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!parsedCommandObj}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-[0.98]"
                  >
                    Add Transaction
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Settings Modal */}
      <Transition appear show={isSettingsModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsSettingsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-md" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[440px] transform overflow-hidden rounded-2xl bg-white dark:bg-[#141414e6] border border-neutral-200 dark:border-white/10 p-6 text-left shadow-2xl transition-all">
                <Dialog.Title as="div" className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-neutral-100 dark:bg-white/5 rounded-lg border border-neutral-200 dark:border-white/10">
                      <FiSettings className="text-neutral-600 dark:text-neutral-300 text-lg" />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-800 dark:text-white">Settings</h3>
                      <p className="text-[11px] text-neutral-400 dark:text-gray-500">Configure profile preferences and account settings</p>
                    </div>
                  </div>
                  <button onClick={() => setIsSettingsModalOpen(false)} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition">
                    <FiX size={20} />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  {/* Name field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Display Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="My Account"
                      value={settingsName}
                      onChange={e => setSettingsName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl text-sm text-neutral-800 dark:text-white focus:outline-none focus:border-emerald-500 transition-all font-geist"
                    />
                  </div>

                  {/* Currency Picker */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Preferred Currency Symbol</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['₹', '$', '€', '£'].map(sym => (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => setCurrency(sym)}
                          className={`py-2 text-sm font-bold rounded-xl border transition-all ${
                            currency === sym 
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                          }`}
                        >
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition shadow-md active:scale-[0.98] mt-2"
                  >
                    Save Settings
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Mobile Top Navbar */}
      <header className="md:hidden h-16 w-full flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md z-40 transition-colors duration-300">
        <button 
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 text-neutral-800 dark:text-white hover:bg-neutral-200/50 dark:hover:bg-white/10 rounded-xl transition"
        >
          <FiMenu className="text-xl" />
        </button>
        
        {/* Center Logo */}
        <Link 
          to={user ? "/app" : "/"} 
          onClick={(e) => {
            if (!user && window.location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-2 font-serif font-bold text-lg text-neutral-800 dark:text-white"
        >
          <div className="w-6 h-6 flex items-center justify-center shrink-0">
            <img 
              src="/favicon.ico" 
              alt="Spendzy Logo" 
              className="dark:hidden w-full h-full object-contain bg-white rounded-md p-0.5" 
            />
            <img 
              src="/favicon.png" 
              alt="Spendzy Logo" 
              className="hidden dark:block w-[90%] h-[90%] object-contain" 
            />
          </div>
          <span className="tracking-tight">Spend<span className="text-emerald-500">zy</span></span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <button 
              onClick={() => setIsSettingsModalOpen(true)}
              className="w-8 h-8 rounded-full bg-neutral-800 dark:bg-white flex items-center justify-center text-white dark:text-black text-xs font-bold shadow-md cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all"
            >
              {getInitials(user.email)}
            </button>
          ) : (
            <Link 
              to="/signup"
              className="p-2 text-neutral-800 dark:text-white hover:bg-neutral-200/50 dark:hover:bg-white/10 rounded-xl transition"
            >
              <FiUser className="text-xl" />
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Drawer */}
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
              <Dialog.Panel className="relative flex w-full max-w-[260px] flex-1 flex-col shadow-2xl">
                <div className="absolute top-0 right-[-48px] p-2">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-white bg-white/10 hover:bg-white/20"
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
                <Sidebar 
                  onClose={() => setIsMobileSidebarOpen(false)} 
                  openAuthModal={() => setIsAuthModalOpen(true)}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Persistent Desktop Sidebar */}
      <div className="hidden md:flex w-[230px] flex-shrink-0 flex-col z-30 relative">
        <Sidebar openAuthModal={() => setIsAuthModalOpen(true)} />
      </div>

      {/* Main Canvas Viewport */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10 p-4 sm:p-6 md:p-8">
          <div className="max-w-[1200px] mx-auto w-full pb-10">
            {loading && user ? (
              <div className="flex items-center justify-center p-20 text-neutral-400">Loading data...</div>
            ) : (
              <Outlet context={contextValue} />
            )}
          </div>
        </main>
      </div>

    </div>
  );
}
