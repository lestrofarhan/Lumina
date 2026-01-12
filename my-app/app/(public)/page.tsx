import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import BlogCard from "@/components/common/BlogCard";
import CategoryCard from "@/components/home/CategoryCard";
import CTA from "@/components/home/CTA";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";
import SkeletonGrid from "@/components/skeleton/SkeletonGrid";
import { Suspense } from "react";
import FeaturedStories from "@/components/home/FeaturedStories";

export default async function HomePage() {
  await connectDB();
  // Fetch only published blogs for the featured section
  const featuredBlogs = await Blog.find({ status: "published" })
    .limit(3)
    .sort({ createdAt: -1 });

  return (
    <main>
      <Hero />
      <Stats />

      {/* Featured Stories Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Featured Stories
              </h2>
              <p className="mt-2 text-slate-600">
                Hand-picked articles for you
              </p>
            </div>
            <a
              href="/blogs"
              className="hidden md:flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors group"
            >
              View all{" "}
              <i className="fa-solid fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
            </a>
          </div>

          <Suspense fallback={<SkeletonGrid />}>
            <FeaturedStories />
          </Suspense>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Explore Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <CategoryCard
              name="Dev"
              icon="fa-code"
              colorClass="bg-blue-100"
              iconClass="text-blue-600"
            />
            <CategoryCard
              name="Design"
              icon="fa-pen-nib"
              colorClass="bg-purple-100"
              iconClass="text-purple-600"
            />
            <CategoryCard
              name="Business"
              icon="fa-chart-line"
              colorClass="bg-green-100"
              iconClass="text-green-600"
            />
            <CategoryCard
              name="Marketing"
              icon="fa-bullhorn"
              colorClass="bg-orange-100"
              iconClass="text-orange-600"
            />
            <CategoryCard
              name="Lifestyle"
              icon="fa-heart-pulse"
              colorClass="bg-pink-100"
              iconClass="text-pink-600"
            />
            <CategoryCard
              name="AI"
              icon="fa-robot"
              colorClass="bg-teal-100"
              iconClass="text-teal-600"
            />
          </div>
        </div>
      </section>

      <CTA />
    </main>
  );
}
