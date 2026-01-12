// components/admin/DeleteModal.tsx - Updated version
interface DeleteModalProps {
  type:
    | "delete-blog"
    | "delete-category"
    | "reject-guest-post"
    | "delete-guest-post";
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
}

export default function DeleteModal({
  type,
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
}: DeleteModalProps) {
  if (!isOpen) return null;

  const getDefaultTitle = () => {
    switch (type) {
      case "delete-blog":
        return "Delete Blog Post";
      case "delete-category":
        return "Delete Category";
      case "reject-guest-post":
        return "Reject Guest Post";
      case "delete-guest-post":
        return "Delete Guest Post";
      default:
        return "Confirm Action";
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case "delete-blog":
        return "This action cannot be undone. This will permanently delete the blog post from the system.";
      case "delete-category":
        return "This action cannot be undone. This will permanently delete the category and all associated blog posts will lose their category.";
      case "reject-guest-post":
        return "This guest post will be rejected. The author will be notified.";
      case "delete-guest-post":
        return "This action cannot be undone. The guest post will be permanently deleted.";
      default:
        return "This action cannot be undone.";
    }
  };

  const getDefaultConfirmText = () => {
    switch (type) {
      case "reject-guest-post":
        return "Reject";
      default:
        return "Delete";
    }
  };

  const modalTitle = title || getDefaultTitle();
  const modalMessage = message || getDefaultMessage();
  const modalConfirmText = confirmText || getDefaultConfirmText();

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-triangle-exclamation text-2xl text-red-600"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {modalTitle}
          </h3>
          <p className="text-slate-600 mb-6">{modalMessage}</p>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
            >
              {modalConfirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
