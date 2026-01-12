export default function BlogTableSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header/Filters Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100">
        <div className="h-10 w-full md:w-64 bg-slate-100 rounded-lg"></div>
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-slate-100 rounded-lg"></div>
          <div className="h-10 w-10 bg-slate-100 rounded-lg"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 h-12"></div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="h-12 w-12 bg-slate-100 rounded-lg"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
                  <div className="h-3 w-1/4 bg-slate-100 rounded"></div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="hidden md:block h-6 w-20 bg-slate-100 rounded-full"></div>
                <div className="h-8 w-16 bg-slate-100 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination Skeleton */}
        <div className="p-4 border-t border-slate-100 flex justify-between">
          <div className="h-8 w-24 bg-slate-100 rounded"></div>
          <div className="h-8 w-32 bg-slate-100 rounded"></div>
        </div>
      </div>
    </div>
  );
}
