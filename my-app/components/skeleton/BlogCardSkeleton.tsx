// components/skeletons/BlogCardSkeleton.tsx
export default function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
      {/* Image Placeholder */}
      <div className="h-60 bg-slate-200" />

      <div className="p-6">
        {/* Meta Info Placeholder (Date/Read Time) */}
        <div className="flex space-x-2 mb-3">
          <div className="h-3 w-16 bg-slate-200 rounded" />
          <div className="h-3 w-16 bg-slate-200 rounded" />
        </div>

        {/* Title Placeholder */}
        <div className="h-6 w-3/4 bg-slate-200 rounded mb-3" />

        {/* Paragraph Placeholder */}
        <div className="space-y-2 mb-4">
          <div className="h-3 w-full bg-slate-100 rounded" />
          <div className="h-3 w-full bg-slate-100 rounded" />
          <div className="h-3 w-2/3 bg-slate-100 rounded" />
        </div>

        {/* Author Placeholder */}
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-slate-200 mr-3" />
          <div className="h-4 w-24 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
}
