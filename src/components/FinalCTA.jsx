import MotionFade from "./MotionFade";

export function FinalCTA({ navigate }) {
  return (
    <section className="mt-40 mb-24 text-center">
      <MotionFade>
        <h2 className="text-3xl font-semibold tracking-tight">
          Take control of your finances.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Spendzy helps you stay aware, not overwhelmed.
        </p>
        <div className="mt-8">
          <button
            onClick={() => navigate("/auth")}
            className="px-8 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
          >
            Start using Spendzy
          </button>
        </div>
      </MotionFade>
    </section>
  );
}
