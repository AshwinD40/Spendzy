import React from 'react';
import { useOutletContext } from 'react-router-dom';
import TransactionTable from '../../components/TransactionTable';

export default function TransactionsView() {
  const { transactions, addTransaction } = useOutletContext();

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Transactions</h1>
          <p className="text-gray-400 text-sm">Review, filter, and import your cash flow.</p>
        </div>
      </div>

      <TransactionTable
        transactions={transactions}
        addTransaction={addTransaction}
      />
    </div>
  );
}
