// components/skeletons/SkeletonGrid.tsx
import BlogCardSkeleton from "./BlogCardSkeleton";

export default function SkeletonGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}
