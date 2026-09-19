import React from "react";
import { useOutletContext } from "react-router-dom";
import TransactionTable from "../../components/TransactionTable";

export default function TransactionsView() {
  const { transactions, addTransaction, currency } = useOutletContext();

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Transactions
        </h1>
      </div>

      <TransactionTable
        transactions={transactions}
        addTransaction={addTransaction}
        currency={currency}
      />
    </div>
  );
}
