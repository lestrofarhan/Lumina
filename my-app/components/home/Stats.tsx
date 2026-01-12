import Counter from "../common/Counter";

const stats = [
  { label: "Active Readers", value: 12000, suffix: "k+" }, // Changed to number
  { label: "Published Articles", value: 850, suffix: "+" },
  { label: "Expert Writers", value: 120, suffix: "+" },
  { label: "Community Rating", value: 5, suffix: "/5" }, // Note: rating logic differs slightly
];

export default function Stats() {
  return (
    <section className="bg-white border-y border-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="group">
              <div className="text-3xl font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors flex justify-center">
                <Counter
                  end={stat.label === "Active Readers" ? 12 : stat.value}
                  suffix={stat.suffix}
                />
              </div>
              <div className="text-sm text-slate-500 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
