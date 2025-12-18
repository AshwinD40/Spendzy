import React, { useMemo } from "react";
import {
  LineChart,
  Line,
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

const COLORS = ["#60a5fa", "#34d399", "#fb7185", "#fbbf24", "#a78bfa"];

function Charts({ sortedTransactions }) {
  /* ---------- Line chart data (group by date) ---------- */
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

  /* ---------- Pie chart data (expense only) ---------- */
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

  return (
    <div className="w-full space-y-8">
      {/* --------- LINE CHART --------- */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-gray-200 mb-4">
          Income vs Expense
        </h2>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[640px] h-[280px] sm:min-w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid stroke="#ffffff10" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.8)",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                  }}
                  formatter={value =>
                    `₹ ${value.toLocaleString("en-IN")}`
                  }
                />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#34d399"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#fb7185"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Expense"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --------- PIE CHART --------- */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-gray-200 mb-4">
          Expense Breakdown
        </h2>

        {pieData.length ? (
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.85)",
                    border: "none",
                    borderRadius: "12px",
                    color: "#ffffff",
                  }}
                  itemStyle={{ color: "#ffffff" }}
                  formatter={(value, name) => [
                    `₹ ${value.toLocaleString("en-IN")}`,
                    name,
                  ]}
                />

                <Legend
                  formatter={(value) => (
                    <span className="text-gray-200 text-sm">{value}</span>
                  )}
                />

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>


            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-12">
            No expense data available
          </p>
        )}
      </div>
    </div>
  );
}

export default Charts;
