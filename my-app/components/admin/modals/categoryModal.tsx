import { useState, useEffect } from "react";
import { Category } from "@/types";

interface CategoryModalProps {
  type: "new-category" | "edit-category";
  category?: Category | string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data?: any) => void; // Made data optional to be safe
}

export default function CategoryModal({
  type,
  category,
  isOpen,
  onClose,
  onSave,
}: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (type === "edit-category" && category) {
      if (typeof category === "string") {
        setFormData({
          name: category,
          slug: generateSlug(category),
          description: "",
        });
      } else {
        setFormData({
          name: category.name,
          slug: category.slug,
          description: category.description || "",
        });
      }
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
      });
    }
  }, [type, category]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get ID safely for the PUT request
      const categoryId = typeof category !== "string" ? category?._id : null;

      const url =
        type === "new-category"
          ? "/api/admin/categories"
          : `/api/admin/categories/${categoryId}`;

      const method = type === "new-category" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        // FIX: Pass the result to onSave to match the required signature
        onSave(result);
        onClose();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">
            {type === "new-category" ? "Add New Category" : "Edit Category"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none transition-all"
                placeholder="e.g. Technology"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none transition-all bg-slate-50"
                placeholder="auto-generated"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none transition-all"
                placeholder="Brief description of the category"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 px-6 py-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
