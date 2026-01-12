import React from "react";

// --- Skeleton for the Stat Cards ---
export function StatSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-pulse"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
            <div className="h-10 w-10 bg-slate-100 rounded-lg"></div>
          </div>
          <div className="flex items-baseline space-x-2">
            <div className="h-8 w-16 bg-slate-200 rounded"></div>
            <div className="h-4 w-10 bg-slate-100 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Skeleton for the Table ---
export function TableSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <div className="h-5 w-32 bg-slate-200 rounded"></div>
        <div className="h-4 w-16 bg-slate-100 rounded"></div>
      </div>
      <div className="p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between space-x-4">
            <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
            <div className="h-4 w-1/4 bg-slate-100 rounded"></div>
            <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
            <div className="h-4 w-12 bg-slate-100 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
