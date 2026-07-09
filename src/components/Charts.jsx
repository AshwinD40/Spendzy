import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTheme } from "../hooks/useTheme";

const COLORS = ["#60a5fa", "#34d399", "#fb7185", "#fbbf24", "#a78bfa"];

function Charts({ sortedTransactions, currency = "₹" }) {
  const [theme] = useTheme();
  const isDark = theme === "dark";

  const lineData = useMemo(() => {
    const map = {};

    sortedTransactions.forEach(txn => {
      if (!map[txn.date]) {
        map[txn.date] = {
          date: txn.date,
          income: 0,
          expense: 0,
        };
      }

      if (txn.type === "income") {
        map[txn.date].income += txn.amount;
      } else {
        map[txn.date].expense += txn.amount;
      }
    });

    return Object.values(map);
  }, [sortedTransactions]);

  const normalizeType = (type) => type?.toLowerCase().trim();

  const pieData = useMemo(() => {
    const grouped = {};

    sortedTransactions
      .filter(txn => normalizeType(txn.type) === "expense")
      .forEach(txn => {
        const tag = txn.tag || "Other";
        grouped[tag] = (grouped[tag] || 0) + Number(txn.amount);
      });

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
    }));
  }, [sortedTransactions]);

  const totalExpenses = useMemo(() => {
    return pieData.reduce((acc, curr) => acc + curr.value, 0);
  }, [pieData]);

  return (
    <div className="w-full space-y-8">
      <div className="rounded-2xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-4 sm:p-6 shadow-sm dark:shadow-none transition-all duration-300">
        <h2 className="text-sm font-semibold text-neutral-800 dark:text-gray-200 mb-4">
          Income vs Expense
        </h2>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[640px] h-[300px] sm:min-w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb7185" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#fb7185" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={isDark ? "#ffffff12" : "#0000000f"} strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  stroke={isDark ? "#888888" : "#6b7280"} 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke={isDark ? "#888888" : "#6b7280"} 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dx={-5}
                  width={35}
                  tickFormatter={(v) => {
                    if (v === 0) return "0";
                    if (Math.abs(v) >= 1000) return `${v / 1000}k`;
                    return v;
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: isDark ? "rgba(10,10,10,0.95)" : "rgba(255,255,255,0.98)",
                    borderRadius: "16px",
                    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e5e7eb",
                    color: isDark ? "#171717" : "#171717",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: isDark ? "#ffffff" : "#171717" }}
                  formatter={value =>
                    `${currency} ${value.toLocaleString("en-IN")}`
                  }
                />
                <Legend 
                  wrapperStyle={{ 
                    color: isDark ? "#e5e7eb" : "#374151",
                    fontSize: "12px",
                    paddingTop: "15px"
                  }} 
                  iconType="circle"
                  iconSize={8}
                />

                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#34d399"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0, fill: "#34d399" }}
                  name="Income"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#fb7185"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorExpense)"
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0, fill: "#fb7185" }}
                  name="Expense"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-4 sm:p-5 shadow-sm dark:shadow-none transition-all duration-300">
        <h2 className="text-sm font-semibold text-neutral-800 dark:text-gray-200 mb-4">
          Expense Breakdown
        </h2>

        {pieData.length ? (
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 min-h-[220px]">
            {/* Donut Chart on Left */}
            <div className="relative w-full md:w-1/2 flex flex-col items-center justify-center h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      background: isDark ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.95)",
                      border: isDark ? "none" : "1px solid #e5e7eb",
                      borderRadius: "12px",
                      color: isDark ? "#ffffff" : "#171717",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                    itemStyle={{ color: isDark ? "#ffffff" : "#171717" }}
                    formatter={(value, name) => [
                      `${currency} ${value.toLocaleString("en-IN")}`,
                      name,
                    ]}
                  />

                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    startAngle={90}
                    endAngle={-270}
                    innerRadius="70%"
                    outerRadius="90%"
                    cornerRadius={6}
                    paddingAngle={4}
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center label overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className="text-[9px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-bold">
                  Total Spent
                </span>
                <p className="text-xl font-extrabold text-neutral-900 dark:text-white mt-0.5 font-geist">
                  {currency}{totalExpenses.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Custom categories list legend on Right */}
            <div className="w-full md:w-1/2 flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
              {pieData.map((item, index) => {
                const color = COLORS[index % COLORS.length];
                const percent = totalExpenses > 0 ? ((item.value / totalExpenses) * 100).toFixed(1) : 0;
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition duration-200 shadow-sm dark:shadow-none"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 capitalize">
                          {item.name}
                        </span>
                        <span className="text-[9px] font-bold text-neutral-500 dark:text-neutral-400 tracking-wider">
                          {percent}% OF TOTAL
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 font-geist">
                      {currency}{item.value.toLocaleString("en-IN")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-neutral-500 dark:text-gray-400 text-center py-12">
            No expense data available
          </p>
        )}
      </div>
    </div>
  );
}

export default Charts;
