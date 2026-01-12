export default function BlogLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Header Skeleton */}
      <div className="py-24 bg-slate-100">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <div className="h-6 w-32 bg-slate-200 rounded-full" />
          <div className="h-16 w-3/4 bg-slate-200 rounded-xl" />
          <div className="flex gap-4">
            <div className="h-10 w-40 bg-slate-200 rounded-full" />
            <div className="h-10 w-24 bg-slate-200 rounded-full" />
          </div>
        </div>
      </div>

      {/* Image Skeleton */}
      <div className="max-w-6xl mx-auto px-4 -mt-24">
        <div className="aspect-[21/9] rounded-3xl bg-slate-300 border-[12px] border-white shadow-xl" />
      </div>

      {/* Content Skeleton */}
      <div className="max-w-3xl mx-auto px-4 py-20 space-y-4">
        <div className="h-4 w-full bg-slate-100 rounded" />
        <div className="h-4 w-full bg-slate-100 rounded" />
        <div className="h-4 w-5/6 bg-slate-100 rounded" />
        <div className="h-4 w-full bg-slate-100 rounded" />
        <div className="pt-8 h-4 w-2/3 bg-slate-100 rounded" />
      </div>
    </div>
  );
}
