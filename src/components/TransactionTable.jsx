import { useMemo, useState } from "react";
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

function TransactionTable({ transactions, addTransaction, currency = "₹" }) {
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
            if (!row.name || !row.amount) continue;
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
        cell: ({ table, row }) => {
          const { pageIndex, pageSize } = table.getState().pagination;
          const visibleIndex = table.getRowModel().rows.findIndex(r => r.id === row.id);
          return (
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 tabular-nums">
              {pageIndex * pageSize + visibleIndex + 1}
            </span>
          );
        }
      },
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) => (
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
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
                isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {currency} {Number(info.getValue()).toLocaleString("en-IN")}
            </span>
          );
        },
      },
      {
        header: "Tag",
        accessorKey: "tag",
        cell: (info) => (
          <span
            className={`text-[10px] font-bold uppercase tracking-wider
            px-2 py-0.5 rounded-full border ${
              info.getValue()
                ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                : "bg-rose-50 dark:bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400"
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
              className={`text-[10px] font-bold uppercase tracking-wider
              px-2 py-0.5 rounded-full ${
                isIncome
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400"
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
          <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-400">
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

  return (
    <div className="w-full space-y-6">
      
      <div className="relative rounded-2xl sm:rounded-3xl p-[1px] bg-gradient-to-br from-neutral-200/60 dark:from-neutral-800/40 via-neutral-100 dark:via-neutral-900/10 to-transparent shadow-sm">
        <div
          className="rounded-2xl sm:rounded-3xl 
          bg-white dark:bg-neutral-900 
          border border-neutral-200/80 dark:border-neutral-800/80 
          p-3 sm:p-5 space-y-3 sm:space-y-5"
        >
          {/* Top Row: Search and Type selector */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">

            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <BiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 text-sm" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search description..."
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 
                py-2 sm:py-2.5 
                rounded-xl sm:rounded-2xl
                bg-neutral-50 dark:bg-neutral-950
                border border-neutral-300 dark:border-neutral-800
                text-neutral-800 dark:text-neutral-200 text-sm
                placeholder-neutral-400 dark:placeholder-neutral-500
                focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-500
                transition-all duration-200"
              />
            </div>

            {/* Type Selector Dropdown */}
            <div className="relative w-full sm:w-auto">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full appearance-none
                rounded-xl sm:rounded-2xl 
                px-3 sm:px-4 py-2 sm:py-2.5 pr-9 sm:pr-10
                bg-neutral-50 dark:bg-neutral-950
                border border-neutral-300 dark:border-neutral-800
                text-neutral-800 dark:text-neutral-200 text-sm
                focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-500
                transition-all duration-200"
              >
                <option className="bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200" value="all">All Types</option>
                <option className="bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200" value="income">Income</option>
                <option className="bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200" value="expense">Expense</option>
              </select>

              <span className="pointer-events-none absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 text-[10px]">
                ▼
              </span>
            </div>
          </div>

          {/* Bottom Row: Sort keys and CSV operations */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">

            {/* Sort Buttons */}
            <div className="flex gap-2">
              {["date", "amount"].map((key) => (
                <button
                  key={key}
                  onClick={() => handleDateSort(key)}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 
                  rounded-lg sm:rounded-xl text-xs font-semibold
                  border transition-all duration-200
                  ${
                    sortKey === key
                      ? "bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-white shadow-inner"
                      : "bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
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

            {/* CSV Actions */}
            <div className="hidden sm:flex gap-2">
              <button
                onClick={exportCSV}
                className="px-4 py-2 rounded-xl text-sm font-semibold
                bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800
                text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-200"
              >
                Export CSV
              </button>

              <label className="px-4 py-2 rounded-xl text-sm font-semibold
                bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800
                text-neutral-600 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-200">
                Import CSV
                <input type="file" accept=".csv" hidden onChange={importCSV} />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800/80 shadow-md dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)] relative overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full border-collapse">
            <thead className="bg-neutral-50 dark:bg-neutral-950">
              {table.getHeaderGroups().map((hg) => (
                <tr
                  key={hg.id}
                  className="border-b border-neutral-200 dark:border-neutral-800/85"
                >
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
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
                  className="border-b border-neutral-100 dark:border-neutral-800/80 hover:bg-neutral-50/80 dark:hover:bg-neutral-950/85 transition-all duration-150"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
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

        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 dark:border-neutral-800/80 text-xs text-neutral-500 dark:text-neutral-400 font-semibold">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>

          <div className="flex gap-2">
            <button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              className="px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 disabled:opacity-40 transition-all duration-200"
            >
              Prev
            </button>
            <button
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              className="px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 disabled:opacity-40 transition-all duration-200"
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
