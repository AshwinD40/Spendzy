import { motion } from "framer-motion";

function Card({ children }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6"
    >
      {children}
    </motion.div>
  );
}

function Bar({ h }) {
  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: h }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-6 bg-blue-400/70 rounded-md"
    />
  );
}

export function VisualSection() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-24">
      <Card>
        <p className="text-sm text-muted-foreground mb-4">
          Monthly flow
        </p>
        <div className="flex items-end gap-2 h-32">
          <Bar h={80} />
          <Bar h={120} />
          <Bar h={60} />
          <Bar h={140} />
          <Bar h={90} />
        </div>
      </Card>

      <Card>
        <p className="text-sm text-muted-foreground mb-4">
          Recent activity
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between">
            <span>Salary</span>
            <span className="text-green-400">+₹80,000</span>
          </li>
          <li className="flex justify-between">
            <span>Rent</span>
            <span className="text-red-400">−₹25,000</span>
          </li>
          <li className="flex justify-between">
            <span>Groceries</span>
            <span className="text-red-400">−₹6,200</span>
          </li>
        </ul>
      </Card>

      <Card>
        <p className="text-sm text-muted-foreground mb-4">
          Insight
        </p>
        <p className="text-lg font-medium">
          You saved <span className="text-blue-400">18%</span> more this month
        </p>
      </Card>
    </section>
  );
}
