import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import Cards from '../../components/Common/Cards';
import Charts from '../../components/Charts';
import NoTransaction from '../../components/Common/NoTransaction';

export default function OverviewView() {
  const { transactions, showExpenseModal, showIncomeModal } = useOutletContext();

  const income = useMemo(() => transactions.filter(t => t.type === 'income').reduce((a,b) => a + b.amount, 0), [transactions]);
  const expense = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((a,b) => a + b.amount, 0), [transactions]);
  const totalBalance = income - expense;

  const sortedTransactions = useMemo(() => [...transactions].sort((a,b) => new Date(a.date) - new Date(b.date)), [transactions]);

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Overview</h1>
        <p className="text-gray-400 text-sm">Welcome back! Here is your financial summary.</p>
      </div>

      <Cards
        income={income}
        expense={expense}
        totalBalance={totalBalance}
        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
      />

      <div className="pt-4">
        {transactions.length !== 0 ? (
          <Charts sortedTransactions={sortedTransactions} />
        ) : (
          <NoTransaction />
        )}
      </div>
    </div>
  );
}
