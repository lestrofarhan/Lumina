"use client";
import React from "react";
import Link from "next/link";

interface BlogProps {
  blog: {
    _id: string;
    title?: string;
    content?: string;
    featuredImage?: string;
    slug?: string;
    articleTitle?: string;
    articleContent?: string;
    image?: string;

    // ✅ FIXED
    categoryName?: string;

    name?: string;
    authorName?: string;
    authorImage?: string;
    createdAt: string;
  };
}

export default function BlogCard({ blog }: BlogProps) {
  // 1. Normalize the data
  const title = blog.articleTitle || blog.title || "Untitled Post";
  const content = blog.articleContent || blog.content || "";
  const displayImage =
    blog.image ||
    blog.featuredImage ||
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085";
  const author = blog.name || blog.authorName || "Lumina Staff";
  const slug = blog.slug || blog._id;

  // 2. CLEAN CONTENT LOGIC
  const textOnly = content
    .replace(/<[^>]*>?/gm, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

  const readTime = Math.ceil(textOnly.split(/\s+/).length / 200) || 1;

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-slate-100 flex flex-col h-full">
      {/* Image Wrapper */}
      <Link href={`/blogs/${slug}`} className="relative h-60 overflow-hidden">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-indigo-600 shadow-sm">
          {/* ✅ ONLY THIS LINE CHANGED */}
          {blog.categoryName || "General"}
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-xs text-slate-500 mb-3 space-x-2">
          <span>{formattedDate}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>{readTime} min read</span>
        </div>

        <Link href={`/blog/${slug}`}>
          <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-grow">
          {textOnly}
        </p>

        {/* Author Footer */}
        <div className="flex items-center mt-auto pt-4 border-t border-slate-50">
          <img
            src={
              blog.authorImage ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                author
              )}&background=random`
            }
            alt="Author"
            className="w-8 h-8 rounded-full mr-3 border border-slate-100"
          />
          <span className="text-sm font-medium text-slate-900">{author}</span>
        </div>
      </div>
    </article>
  );
}
