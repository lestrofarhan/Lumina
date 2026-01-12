// components/admin/BlogTable.tsx
import { Blog } from "@/types";
import { useState } from "react";

interface BlogTableProps {
  blogs: Blog[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalBlogs: number;
  onEdit: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
  onNewBlog: () => void;
  onNewCategory: () => void;
}

export default function BlogTable({
  blogs,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  currentPage,
  setCurrentPage,
  totalPages,
  totalBlogs,
  onEdit,
  onDelete,
  onNewBlog,
  onNewCategory,
}: BlogTableProps) {
  const [loading, setLoading] = useState(false);

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get category name from categoryId
  const getCategoryName = (categoryId: string) => {
    // This would need to be passed from parent or fetched
    return categoryId; // Default to showing ID, you can map to names
  };

  // Get author display
  const getAuthorDisplay = (blog: Blog) => {
    if (blog.author) {
      return (
        <div className="flex items-center">
          {blog.author.avatar ? (
            <img
              src={blog.author.avatar}
              alt={blog.author.name}
              className="h-6 w-6 rounded-full mr-2 object-cover"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center mr-2">
              <span className="text-xs text-slate-600 font-medium">
                {blog.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="text-slate-900">{blog.author.name}</span>
        </div>
      );
    } else if (blog.authorId === "guest") {
      return (
        <div className="flex items-center">
          <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center mr-2">
            <i className="fa-solid fa-user text-xs text-slate-600"></i>
          </div>
          <span className="text-slate-900">Guest Author</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center">
          <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center mr-2">
            <i className="fa-solid fa-user text-xs text-slate-600"></i>
          </div>
          <span className="text-slate-900">Admin</span>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-semibold text-slate-800">All Blog Posts</h3>
          <p className="text-sm text-slate-500 mt-1">
            Manage your published and draft articles
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none w-full sm:w-48"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <i className="fa-solid fa-search text-slate-400 text-sm"></i>
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
         
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Author</th>
              <th className="px-6 py-3">Created</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex justify-center">
                    <div className="spinner h-6 w-6 border-2 border-primary-100 border-t-primary-600"></div>
                  </div>
                </td>
              </tr>
            ) : blogs.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  <i className="fa-regular fa-file-lines text-3xl mb-3 block"></i>
                  <p>No blog posts found</p>
                 
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr
                  key={blog._id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {blog.featuredImage && (
                        <div className="h-10 w-10 rounded-md bg-slate-200 mr-3 overflow-hidden flex-shrink-0">
                          <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-slate-900">
                          {blog.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          /blogs/{blog.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        blog.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {blog.status.charAt(0).toUpperCase() +
                        blog.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs">
                      {getCategoryName(blog.categoryId)}
                    </span>
                  </td>
                  <td className="px-6 py-4">{getAuthorDisplay(blog)}</td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900">
                      {formatDate(blog.createdAt)}
                    </div>
                    {blog.status === "published" && (
                      <div className="text-xs text-slate-500">
                        <i className="fa-regular fa-eye mr-1"></i>
                        {blog.views || 0} views
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(blog)}
                        className="text-slate-400 hover:text-primary-600 p-1.5 rounded-lg hover:bg-primary-50 transition-colors"
                        title="Edit"
                      >
                        <i className="fa-solid fa-pen text-sm"></i>
                      </button>
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this blog post?"
                            )
                          ) {
                            onDelete(blog);
                          }
                        }}
                        className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <i className="fa-solid fa-trash text-sm"></i>
                      </button>
                      {blog.status === "published" && (
                        <a
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-green-600 p-1.5 rounded-lg hover:bg-green-50 transition-colors"
                          title="View Live"
                        >
                          <i className="fa-solid fa-external-link text-sm"></i>
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {blogs.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-700">
              {Math.min((currentPage - 1) * 4 + 1, totalBlogs)}
            </span>
            -
            <span className="font-medium text-slate-700">
              {Math.min(currentPage * 4, totalBlogs)}
            </span>{" "}
            of <span className="font-medium text-slate-700">{totalBlogs}</span>{" "}
            posts
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <i className="fa-solid fa-chevron-left mr-1 text-xs"></i>
              Previous
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                // For pagination with more than 5 pages
                let displayPage = pageNum;
                if (totalPages > 5) {
                  if (currentPage <= 3) {
                    displayPage = pageNum;
                  } else if (currentPage >= totalPages - 2) {
                    displayPage = totalPages - 5 + pageNum;
                  } else {
                    displayPage = currentPage - 2 + pageNum;
                  }
                }
                return (
                  <button
                    key={displayPage}
                    onClick={() => setCurrentPage(displayPage)}
                    className={`h-8 w-8 text-sm rounded-lg transition-colors ${
                      currentPage === displayPage
                        ? "bg-primary-600 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {displayPage}
                  </button>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="text-slate-400">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="h-8 w-8 text-sm rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              Next
              <i className="fa-solid fa-chevron-right ml-1 text-xs"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
