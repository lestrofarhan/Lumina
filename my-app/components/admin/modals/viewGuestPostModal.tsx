// components/admin/ViewGuestPostModal.tsx
import { GuestPost } from "@/types";

interface ViewGuestPostModalProps {
  post: GuestPost | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export default function ViewGuestPostModal({
  post,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: ViewGuestPostModalProps) {
  if (!isOpen || !post) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Guest Post Details</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">
                Article Title
              </label>
              <p className="text-lg font-semibold text-slate-900">
                {post.articleTitle}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">
                  Author
                </label>
                <p className="text-slate-900">{post.name}</p>
                <p className="text-sm text-slate-500">{post.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">
                  Category
                </label>
                <p className="text-slate-900">{post.category}</p>
              </div>
            </div>

            {post.website && (
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">
                  Website
                </label>
                <p className="text-slate-900">{post.website}</p>
              </div>
            )}

            {(post.backlink || post.anchorText) && (
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">
                  Backlink Details
                </label>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  {post.backlink && (
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">URL:</span> {post.backlink}
                    </p>
                  )}
                  {post.anchorText && (
                    <p className="text-sm text-slate-700 mt-1">
                      <span className="font-medium">Anchor Text:</span>{" "}
                      {post.anchorText}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">
                Content Preview
              </label>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 max-h-64 overflow-y-auto">
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                  {post.articleContent.slice(0, 500)}
                  {post.articleContent.length > 500 ? "..." : ""}
                </p>
              </div>
            </div>

            {post.image && (
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">
                  Featured Image
                </label>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <img
                    src={post.image}
                    alt={post.articleTitle}
                    className="max-w-full h-auto rounded"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onReject();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
          >
            Reject
          </button>
          <button
            onClick={() => {
              onApprove();
              onClose();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
          >
            Approve & Publish
          </button>
        </div>
      </div>
    </div>
  );
}
