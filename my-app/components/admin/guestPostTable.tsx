// components/admin/GuestPostsTable.tsx
import { GuestPost } from "@/types";

interface GuestPostsTableProps {
  guestPosts: GuestPost[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalPosts: number;
  startIndex: number;
  itemsPerPage: number;
  onView: (post: GuestPost) => void;
  onApprove: (post: GuestPost) => void;
  onReject: (post: GuestPost) => void;
  onDelete: (post: GuestPost) => void;
  onPublish: (postId: string) => void;
  getStatusColor: (status: GuestPost["status"]) => string;
}

export default function GuestPostsTable({
  guestPosts,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  currentPage,
  setCurrentPage,
  totalPages,
  totalPosts,
  startIndex,
  itemsPerPage,
  onView,
  onApprove,
  onReject,
  onDelete,
  onPublish,
  getStatusColor,
}: GuestPostsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-semibold text-slate-800">
            Guest Post Submissions
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Review and manage guest post requests
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-3">Article Title</th>
              <th className="px-6 py-3">Author</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Submitted</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {guestPosts.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  <i className="fa-regular fa-file-alt text-3xl mb-3 block"></i>
                  <p>No guest posts found</p>
                  {searchTerm || statusFilter !== "all" ? (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                      }}
                      className="mt-4 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
                    >
                      Clear Filters
                    </button>
                  ) : (
                    <p className="text-sm mt-2">
                      Guest posts will appear here when submitted
                    </p>
                  )}
                </td>
              </tr>
            ) : (
              guestPosts.map((post) => (
                <tr
                  key={post._id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 line-clamp-2">
                      {post.articleTitle}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Category: {post.category || "Uncategorized"}
                    </div>
                    {post.website && (
                      <div className="text-xs text-slate-500 mt-1">
                        Website: {post.website}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-slate-900">
                        {post.name}
                      </div>
                      <div className="text-xs text-slate-500">{post.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        post.status
                      )}`}
                    >
                      {post.status.charAt(0).toUpperCase() +
                        post.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900">
                      {formatDate(post.createdAt)}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(post.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-1">
                      {/* View button - always visible */}
                      <button
                        onClick={() => onView(post)}
                        className="text-slate-400 hover:text-primary-600 p-1.5 rounded-lg hover:bg-primary-50 transition-colors"
                        title="View Details"
                      >
                        <i className="fa-solid fa-eye text-sm"></i>
                      </button>

                      {/* Approve button - only for pending posts */}
                      {post.status === "pending" && (
                        <button
                          onClick={() => onApprove(post)}
                          className="text-slate-400 hover:text-green-600 p-1.5 rounded-lg hover:bg-green-50 transition-colors"
                          title="Approve"
                        >
                          <i className="fa-solid fa-check text-sm"></i>
                        </button>
                      )}

                      {/* Edit button - for approved posts */}
                      {post.status === "approved" && (
                        <button
                          onClick={() => {
                            // Navigate to edit page or open edit modal
                            window.location.href = `/admin/guest-posts/${post._id}/edit`;
                          }}
                          className="text-slate-400 hover:text-primary-600 p-1.5 rounded-lg hover:bg-primary-50 transition-colors"
                          title="Edit"
                        >
                          <i className="fa-solid fa-pen text-sm"></i>
                        </button>
                      )}

                      {/* Publish button - for approved posts */}
                      {post.status === "approved" && (
                        <button
                          onClick={() => onPublish(post._id)}
                          className="text-slate-400 hover:text-green-600 p-1.5 rounded-lg hover:bg-green-50 transition-colors"
                          title="Publish as Blog"
                        >
                          <i className="fa-solid fa-upload text-sm"></i>
                        </button>
                      )}

                      {/* External link - for published posts */}
                      {post.status === "published" && (
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-primary-600 p-1.5 rounded-lg hover:bg-primary-50 transition-colors"
                          title="View Live"
                        >
                          <i className="fa-solid fa-external-link text-sm"></i>
                        </a>
                      )}

                      {/* Reject button - for pending posts */}
                      {post.status === "pending" && (
                        <button
                          onClick={() => onReject(post)}
                          className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          title="Reject"
                        >
                          <i className="fa-solid fa-xmark text-sm"></i>
                        </button>
                      )}

                      {/* Delete button - for rejected posts or as alternative */}
                      {(post.status === "rejected" ||
                        post.status === "published") && (
                        <button
                          onClick={() => onDelete(post)}
                          className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <i className="fa-solid fa-trash text-sm"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {guestPosts.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-700">{startIndex + 1}</span>
            -
            <span className="font-medium text-slate-700">
              {Math.min(startIndex + itemsPerPage, totalPosts)}
            </span>{" "}
            of <span className="font-medium text-slate-700">{totalPosts}</span>{" "}
            submissions
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
