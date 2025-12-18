import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Common/Navbar";
import DashboardPreview from "../assets/Dashboard.png"; // use your real screenshot

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-1/3 -left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[180px]" />
        <div className="absolute -bottom-1/3 -right-1/4 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[180px]" />
      </div>

      {/* HERO */}
      <Navbar />
      <section className="relative z-10 pt-36 pb-28 max-w-6xl mx-auto px-6">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl sm:text-6xl font-semibold tracking-tight leading-tight"
        >
          Money, finally
          <br />
          <span className="text-blue-400">working for you.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mt-6 text-lg text-muted-foreground max-w-xl"
        >
          Spendzy turns income and expenses into clear decisions.
          No spreadsheets. No noise. Just clarity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-10 flex items-center gap-5"
        >
          <button
            onClick={() => navigate("/auth")}
            className="px-7 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
          >
            Start tracking
          </button>
          <span className="text-sm text-muted-foreground">
            Free · Private · No ads
          </span>
        </motion.div>
      </section>

      {/* PRODUCT PROOF */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative rounded-3xl bg-white/[0.06] backdrop-blur-xl
          border border-white/20 shadow-[0_40px_120px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          <img
            src={DashboardPreview}
            alt="Spendzy dashboard"
            className="w-full object-cover"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
        </motion.div>
      </section>

      {/* OUTCOMES */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-28">
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Clarity over chaos",
              desc: "See your entire financial life at a glance. No digging, no guesswork.",
            },
            {
              title: "Built for patterns",
              desc: "Spot trends before they become problems. Your data, explained.",
            },
            {
              title: "Private by default",
              desc: "Your money stays yours. No ads, no tracking, no selling your data.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-white/[0.04] backdrop-blur-xl
              border border-white/15 p-6"
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-36 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-semibold tracking-tight"
        >
          See your money clearly.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-muted-foreground"
        >
          Start building better habits in minutes.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate("/auth")}
          className="mt-8 px-8 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
        >
          Get started
        </motion.button>
      </section>
    </div>
  );
}
