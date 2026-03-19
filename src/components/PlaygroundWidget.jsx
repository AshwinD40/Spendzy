import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiArrowUpRight, FiArrowDownRight, FiActivity } from 'react-icons/fi';

const initialData = [
  { id: 1, name: "Salary", amount: 65000, type: "income", date: "Oct 1" },
  { id: 2, name: "Rent", amount: 18000, type: "expense", date: "Oct 2" },
  { id: 3, name: "Groceries", amount: 4500, type: "expense", date: "Oct 4" },
  { id: 4, name: "Freelance", amount: 12000, type: "income", date: "Oct 10" },
  { id: 5, name: "Coffee", amount: 250, type: "expense", date: "Oct 11" },
];

export default function PlaygroundWidget() {
  const [transactions, setTransactions] = useState(initialData);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    
    const newTx = {
      id: Date.now(),
      name,
      amount: Number(amount),
      type,
      date: "Just now"
    };
    
    setTransactions(prev => [...prev.slice(-4), newTx]);
    setName("");
    setAmount("");
  };

  const currentBalance = useMemo(() => {
    return transactions.reduce((acc, curr) => 
      curr.type === 'income' ? acc + curr.amount : acc - curr.amount
    , 0);
  }, [transactions]);

  const renderItem = (t) => (
    <motion.div 
      key={t.id} 
      initial={{ opacity: 0, height: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, height: 'auto', scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      layout
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/5 shadow-sm"
    >
      <div className="flex flex-col text-left">
        <span className="text-xs font-bold text-gray-200">{t.name}</span>
        <span className="text-[10px] text-gray-500 font-medium">{t.date}</span>
      </div>
      <div className={`flex items-center font-bold text-xs tracking-wide ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
        {t.type === 'income' ? <FiArrowUpRight className="mr-0.5 opacity-80" size={12}/> : <FiArrowDownRight className="mr-0.5 opacity-80" size={12}/>}
        ₹{Number(t.amount).toLocaleString('en-IN')}
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col w-full bg-[#080808] backdrop-blur-3xl rounded-[inherit] overflow-hidden shadow-2xl">
      
      {/* Top Header & Balance */}
      <div className="p-5 border-b border-[#222]">
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 rounded-md border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <FiActivity className="text-emerald-500 text-sm" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold text-[13px] tracking-wide">Live Sandbox</span>
                <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 tracking-widest uppercase shadow-sm">Demo</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-[9px] uppercase tracking-widest font-bold mb-0.5">Net Position</p>
            <p className="text-white font-bold text-xl tabular-nums tracking-tight">₹{currentBalance.toLocaleString('en-IN')}</p>
          </div>
        </div>
        
        <form onSubmit={handleAdd} className="space-y-3 relative z-20">
          <div className="flex bg-[#111] p-1 rounded-xl border border-[#333] shadow-inner">
            <button 
              type="button" 
              onClick={() => setType("expense")} 
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${type === 'expense' ? 'bg-[#222] text-rose-400 shadow-md border border-[#333]' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Expense
            </button>
            <button 
              type="button" 
              onClick={() => setType("income")} 
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${type === 'income' ? 'bg-[#222] text-emerald-400 shadow-md border border-[#333]' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Income
            </button>
          </div>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="E.g. Lunch" 
              value={name} 
              onChange={e=>setName(e.target.value)} 
              className="w-full bg-[#111] border border-[#333] rounded-xl px-3 py-2 text-xs font-medium text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner" 
              autoComplete="off"
            />
            <div className="relative w-24 shrink-0">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">₹</span>
              <input 
                type="number" 
                placeholder="400" 
                value={amount} 
                onChange={e=>setAmount(e.target.value)} 
                className="w-full bg-[#111] border border-[#333] rounded-xl pl-6 pr-2 py-2 text-xs font-medium text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner" 
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-[0.98] flex items-center justify-center gap-1.5 ring-1 ring-emerald-500/50"
          >
            <FiPlus className="text-base"/> Add to feed
          </button>
        </form>
      </div>

      {/* Feed */}
      <div className="flex flex-col flex-1 p-5 relative bg-[#050505] min-h-[220px]">
        {/* Subtle noise overlay specifically for the feed section */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
        
        <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2 relative z-10">
          Last 5 Transactions
          <div className="flex-1 h-px bg-[#222]"></div>
        </h4>
        
        <div className="space-y-2 relative z-10 flex flex-col justify-end">
          <AnimatePresence initial={false}>
            {[...transactions].reverse().map(renderItem)}
          </AnimatePresence>
        </div>
      </div>
      
    </div>
  );
}
