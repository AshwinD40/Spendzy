import React, { useMemo, useState } from "react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { BiSearch } from "react-icons/bi";
import { parse, unparse } from "papaparse";
import toast from "react-hot-toast";

const PAGE_SIZE = 10;

function TransactionTable({ transactions, addTransaction }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const normalizeType = (type) => type?.toLowerCase().trim();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const handleDateSort = (key) => {
    if (key === "date") {
      if (sortKey === "date") {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortKey("date");
        setSortOrder("asc"); // default
      }
    }

    if (key === "amount") {
      if (sortKey === "amount") {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortKey("amount");
        setSortOrder("asc");
      }
    }
  };

  const processedData = useMemo(() => {
    let data = [...transactions];

    data = data.filter((t) => {
      const matchesSearch = t.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesType =
        typeFilter === "all" ||
        normalizeType(t.type) === typeFilter;

      return matchesSearch && matchesType;
    });

    if (sortKey === "date") {
      data.sort((a, b) => {
        const diff = new Date(a.date) - new Date(b.date);
        return sortOrder === "asc" ? diff : -diff;
      });
    }

    if (sortKey === "amount") {
      data.sort((a, b) => {
        const diff = Number(a.amount) - Number(b.amount);
        return sortOrder === "asc" ? diff : -diff;
      });
    }

    return data;
  }, [transactions, search, typeFilter, sortKey, sortOrder]);


  function exportCSV() {
    const csv = unparse(processedData, {
      fields: ["name", "type", "amount", "tag", "date"],
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Transactions.csv";
    link.click();
  }

  async function importCSV(e) {
    try {
      parse(e.target.files[0], {
        header: true,
        complete: async ({ data }) => {
          for (const row of data) {
            await addTransaction(
              { ...row, amount: Number(row.amount) },
              true
            );
          }
        },
      });
      toast.success("CSV imported successfully");
    } catch {
      toast.error("Error importing CSV");
    }
  }

  const columns = useMemo(
    () => [
      {
        header: "No",
        cell: ({table, row }) => {
          const { pageIndex, pageSize } = table.getState().pagination;

          const visibleIndex = table.getRowModel().rows.findIndex(r => r.id === row.id);

          return (
            <span className="text-xs font-medium text-gray-200 tabular-nums">
              { pageIndex * pageSize + visibleIndex + 1 }
            </span>
          )
        }
      },
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) => (
          <span className="text-sm font-medium text-gray-200">
            {info.getValue()}
          </span>
        ),
      },
      {
        header: "Amount",
        accessorKey: "amount",
        cell: (info) => {
          const isIncome = info.row.original.type === "income";
          return (
            <span
              className={`text-sm font-bold tabular-nums ${
                isIncome ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              ₹ {Number(info.getValue()).toLocaleString("en-IN")}
            </span>
          );
        },
      },
      {
        header: "Tag",
        accessorKey: "tag",
        cell: (info) => (
          <span
            className={`text-[11px] font-semibold uppercase tracking-wide
            px-2.5 py-1 rounded-full backdrop-blur-sm border ${
              info.getValue()
                ? "bg-emerald-400/20 border-emerald-400/30 text-emerald-300"
                : "bg-rose-400/20 border-rose-400/30 text-rose-300"
            }`}
          >
            {info.getValue() || "—"}
          </span>
        ),
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => {
          const isIncome = info.getValue() === "income";
          return (
            <span
              className={`text-[11px] font-semibold uppercase tracking-wide
              px-2 py-0.5 rounded-full ${
                isIncome
                  ? "bg-emerald-400/15 text-emerald-400"
                  : "bg-rose-400/15 text-rose-400"
              }`}
            >
              {info.getValue()}
            </span>
          );
        },
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: (info) => (
          <span className="text-xs text-gray-400">
            {info.getValue()}
          </span>
        ),
      },
    ],
    []
  );


  const table = useReactTable({
    data: processedData,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  /* ---------------- UI ---------------- */
  return (
    <div className="w-full space-y-6">
      {/* Filters */}
      <div className="relative rounded-2xl sm:rounded-3xl p-[1px] bg-gradient-to-br from-black/20 via-black/10 to-transparent shadow-xl">
        <div
          className="rounded-2xl sm:rounded-3xl 
          bg-white/10 backdrop-blur-xl 
          border border-white/20 
          p-3 sm:p-5 space-y-3 sm:space-y-5"
        >
          {/* Top Row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">

            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <BiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/60 text-sm" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 
                py-2 sm:py-2.5 
                rounded-xl sm:rounded-2xl
                bg-white/10 backdrop-blur-md 
                border border-white/20 
                text-white text-sm
                placeholder-white/50
                focus:outline-none focus:ring-2 focus:ring-white/30
                transition"
              />
            </div>

            {/* Type Selector */}
            <div className="relative w-full sm:w-auto">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full appearance-none
                rounded-xl sm:rounded-2xl 
                px-3 sm:px-4 py-2 sm:py-2.5 pr-9 sm:pr-10
                bg-white/10 backdrop-blur-md 
                border border-white/20
                text-white text-sm
                focus:outline-none focus:ring-2 focus:ring-white/30
                transition"
              >
                <option className="bg-black text-white" value="all">All</option>
                <option className="bg-black text-white" value="income">Income</option>
                <option className="bg-black text-white" value="expense">Expense</option>
              </select>

              <span className="pointer-events-none absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/60 text-xs">
                ▼
              </span>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">

            {/* Sort Buttons */}
            <div className="flex gap-2">
              {["date", "amount"].map((key) => (
                <button
                  key={key}
                  onClick={() => handleDateSort(key)}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 
                  rounded-lg sm:rounded-xl text-xs font-medium
                  backdrop-blur-md border transition-all
                  ${
                    sortKey === key
                      ? "bg-white/25 border-white/40 text-white shadow-inner"
                      : "bg-white/10 border-white/20 text-white/60 hover:bg-white/15"
                  }`}
                >
                  {key === "date" ? "Date" : "Amount"}
                  {key === "date" && sortKey === "date" && (
                    <span className="ml-1 text-xs">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* CSV Actions – desktop only */}
            <div className="hidden sm:flex gap-2">
              <button
                onClick={exportCSV}
                className="px-4 py-2 rounded-xl text-sm font-medium
                bg-white/20 backdrop-blur-md border border-white/30
                text-white hover:bg-white/30 transition"
              >
                Export CSV
              </button>

              <label className="px-4 py-2 rounded-xl text-sm font-medium
                bg-white/20 backdrop-blur-md border border-white/30
                text-white cursor-pointer hover:bg-white/30 transition">
                Import CSV
                <input type="file" accept=".csv" hidden onChange={importCSV} />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className=" rounded-2xl bg-gradient-to-b from-white/[0.10] via-white/[0.05] to-white/[0.02] backdrop-blur-[36px] border border-white/20 shadow-[0_40px_120px_rgba(0,0,0,0.55)] relative overflow-hidden "
      >
        {/* inner highlight */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />


        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full border-collapse">
            <thead className="bg-white/[0.06]">
              {table.getHeaderGroups().map((hg) => (
                <tr
                  key={hg.id}
                  className="border-b border-white/10"
                >
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className=" px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-300 "
                    >
                      {h.column.columnDef.header}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className=" border-b border-white/10 hover:bg-white/[0.08] hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-150 "
                >
                 
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3" >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className=" flex items-center justify-between px-4 py-3 border-t border-white/10 text-xs text-gray-400" >
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>

          <div className="flex gap-2">
            <button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              className=" px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-gray-200 hover:bg-white/20 disabled:opacity-40 transition "
            >
              Prev
            </button>
            <button
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              className=" px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-gray-200 hover:bg-white/20 disabled:opacity-40  transition "
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionTable;
