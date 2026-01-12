import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon: LucideIcon;
  colorClass: string;
}

export function StatCard({
  title,
  value,
  trend,
  icon: Icon,
  colorClass,
}: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        <span className={`p-2 rounded-lg ${colorClass}`}>
          <Icon size={20} />
        </span>
      </div>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {trend && (
          <span className="ml-2 text-sm text-green-600 font-medium">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
