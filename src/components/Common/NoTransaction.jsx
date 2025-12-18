import React from "react";
import transactions from "../../assets/transactions.svg";

function NoTransaction() {
  return (
    <div className="w-full">
      <div
        className=" w-full rounded-2xl bg-white/[0.04] backdrop-blur-[24px] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)] py-16 flex justify-center "
      >
        <div className="flex flex-col items-center text-center px-6">
          <img
            src={transactions}
            alt="No transactions"
            className=" w-[220px] sm:w-[260px] opacity-90 select-none pointer-events-none mb-6 "
          />
          <p className="text-base font-medium text-gray-200">
            No transactions yet
          </p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            Start by adding your first income or expense to see insights here
          </p>
        </div>
      </div>
    </div>
  );
}

export default NoTransaction;
