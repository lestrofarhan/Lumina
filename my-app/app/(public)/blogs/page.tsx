"use client";
import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import BlogCard from "@/components/common/BlogCard";
import BlogSkeleton from "@/components/skeleton/BlogCardSkeleton";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Filter State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔥 Change: Track ID instead of Name
  const [selectedCategoryId, setSelectedCategoryId] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Load Categories once on mount
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // 2. Load Blogs whenever page or category ID changes
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        // If "All" is selected, we send an empty string to the API
        const categoryParam =
          selectedCategoryId === "All" ? "" : selectedCategoryId;

        const res = await fetch(
          `/api/blogs?page=${page}&category=${categoryParam}`
        );
        const data = await res.json();

        // DATA NORMALIZATION
        const normalizedBlogs = (data.blogs || []).map((blog: any) => {
          // Find category name by matching the ID
          const cat = categories.find(
            (c: any) => c._id === (blog.category || blog.categoryId)
          );

          return {
            ...blog,
            _id: blog._id?.toString(),
            createdAt: blog.createdAt
              ? new Date(blog.createdAt).toISOString()
              : new Date().toISOString(),
            title: blog.title || blog.articleTitle || "Untitled Post",
            featuredImage:
              blog.featuredImage || blog.image || "/placeholder.jpg",
            categoryName: cat
              ? (cat as any).name
              : blog.categoryName || "General",
            author: blog.author || blog.name || "Lumina Contributor",
          };
        });

        setBlogs(normalizedBlogs);
        setTotalPages(data.totalPages || 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("Failed to load blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    // Wait for categories to load if we need to map names,
    // but allow fetching if "All" is selected initially.
    if (categories.length > 0 || selectedCategoryId === "All") {
      fetchBlogs();
    }
  }, [page, selectedCategoryId, categories]);

  // 3. Client-side search (searching within the current page results)
  const displayBlogs = blogs.filter((b: any) =>
    b.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Browse Articles
          </h1>
          <div className="relative group">
            <input
              type="text"
              placeholder="Search current page..."
              className="w-full py-4 pl-14 pr-6 rounded-2xl border border-slate-200 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm bg-white"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600"
              size={22}
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => {
              setSelectedCategoryId("All");
              setPage(1);
            }}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer border ${
              selectedCategoryId === "All"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            All Posts
          </button>

          {categories.map((cat: any) => (
            <button
              key={cat._id}
              onClick={() => {
                // 🔥 Change: Use cat._id here
                setSelectedCategoryId(cat._id);
                setPage(1);
              }}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer border ${
                selectedCategoryId === cat._id
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, i) => <BlogSkeleton key={i} />)
          ) : displayBlogs.length > 0 ? (
            displayBlogs.map((blog: any) => (
              <div key={blog._id} className="animate-fade-in">
                <BlogCard blog={blog} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 inline-flex flex-col items-center">
                <Inbox size={32} className="text-slate-300 mb-4" />
                <p className="text-slate-900 font-bold">No results found</p>
                <button
                  onClick={() => {
                    setSelectedCategoryId("All");
                    setSearchQuery("");
                  }}
                  className="mt-4 text-indigo-600 font-bold"
                >
                  Reset all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center space-x-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white disabled:opacity-30"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-12 h-12 rounded-xl font-bold ${
                    page === i + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-white border text-slate-500"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white disabled:opacity-30"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
