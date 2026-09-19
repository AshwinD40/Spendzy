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

export default function TransactionTable({
  transactions = [],
  addTransaction,
  currency = "₹",
}) {
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
        setSortOrder("asc");
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
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesType =
        typeFilter === "all" || normalizeType(t.type) === typeFilter;

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
          toast.success("CSV Imported!");
        },
      });
    } catch {
      toast.error("Couldn't import CSV");
    }
  }

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) => (
          <span className="font-medium text-xs text-neutral-800 dark:text-neutral-200">
            {info.getValue()}
          </span>
        ),
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => {
          const type = normalizeType(info.getValue());
          return (
            <span
              className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                type === "income"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
              }`}
            >
              {type === "income" ? "Income" : "Expense"}
            </span>
          );
        },
      },
      {
        header: "Amount",
        accessorKey: "amount",
        cell: (info) => {
          const type = normalizeType(info.row.original.type);
          const isIncome = type === "income";
          return (
            <span
              className={`font-semibold text-xs tabular-nums ${
                isIncome
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-neutral-900 dark:text-neutral-100"
              }`}
            >
              {isIncome ? "+" : "-"}
              {currency}
              {Number(info.getValue()).toLocaleString("en-IN")}
            </span>
          );
        },
      },
      {
        header: "Tag",
        accessorKey: "tag",
        cell: (info) => {
          const val = info.getValue();
          return (
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              {val || "General"}
            </span>
          );
        },
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: (info) => (
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            {info.getValue()}
          </span>
        ),
      },
    ],
    [currency]
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
    <div className="w-full space-y-4">
      <div className="rounded-2xl bg-white dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 p-4 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative w-full sm:max-w-xs">
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search description..."
              className="w-full pl-9 pr-3 h-9 rounded-xl bg-neutral-50/50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-auto">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full appearance-none rounded-xl px-3 pr-8 h-9 bg-neutral-50/50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs focus:outline-none focus:border-emerald-500 transition cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px]">
                ▼
              </span>
            </div>

            <div className="flex gap-1.5">
              {["date", "amount"].map((key) => (
                <button
                  key={key}
                  onClick={() => handleDateSort(key)}
                  className={`h-9 px-3 rounded-xl text-xs font-medium border transition ${
                    sortKey === key
                      ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-2xs font-semibold"
                      : "bg-neutral-50/50 dark:bg-neutral-950/50 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  <span className="capitalize">{key}</span>
                  {sortKey === key && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex gap-1.5 ml-auto">
              <button
                type="button"
                onClick={exportCSV}
                className="h-9 px-3 rounded-xl text-xs font-medium bg-neutral-50/50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                Export
              </button>

              <label className="h-9 px-3 rounded-xl text-xs font-medium bg-neutral-50/50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition flex items-center">
                Import
                <input type="file" accept=".csv" hidden onChange={importCSV} />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[680px] w-full border-collapse">
            <thead className="bg-neutral-50/60 dark:bg-neutral-950/60">
              {table.getHeaderGroups().map((hg) => (
                <tr
                  key={hg.id}
                  className="border-b border-neutral-200/70 dark:border-neutral-800/80"
                >
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className="px-4 py-2.5 text-left text-[11px] font-semibold text-neutral-500 dark:text-neutral-400"
                    >
                      {h.column.columnDef.header}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2.5">
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

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-neutral-200/70 dark:border-neutral-800/80 text-xs text-neutral-500 dark:text-neutral-400">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </span>

          <div className="flex gap-1.5">
            <button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              className="px-2.5 h-7 rounded-lg bg-neutral-50/60 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 transition cursor-pointer text-xs"
            >
              Prev
            </button>
            <button
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              className="px-2.5 h-7 rounded-lg bg-neutral-50/60 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 transition cursor-pointer text-xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
