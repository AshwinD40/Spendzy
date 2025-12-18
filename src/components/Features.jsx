import MotionFade from "./MotionFade";

export function Features() {
  const items = [
    {
      title: "Income & Expense clarity",
      text: "See exactly where money comes from and where it goes."
    },
    {
      title: "Visual trends",
      text: "Charts that highlight patterns instead of noise."
    },
    {
      title: "Built for consistency",
      text: "Track over months, not just today."
    }
  ];

  return (
    <section className="mt-32 grid grid-cols-1 sm:grid-cols-3 gap-10">
      {items.map((f, i) => (
        <MotionFade key={f.title} delay={i * 0.1}>
          <div>
            <h3 className="font-medium text-lg">{f.title}</h3>
            <p className="mt-2 text-muted-foreground text-sm">
              {f.text}
            </p>
          </div>
        </MotionFade>
      ))}
    </section>
  );
}
