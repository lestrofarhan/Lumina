// components/admin/CategoriesTable.tsx
import { Category } from "@/types";
import { useEffect, useState } from "react";

interface CategoriesTableProps {
  categories: Category[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onNewCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  getCategoryIcon: (categoryName: string) => {
    icon: string;
    color: string;
    bgColor: string;
  };
}

export default function CategoriesTable({
  categories,
  searchTerm,
  setSearchTerm,
  onNewCategory,
  onEditCategory,
  onDeleteCategory,
  getCategoryIcon,
}: CategoriesTableProps) {
  const [postCounts, setPostCounts] = useState<Record<string, number>>({});

  // Fetch post counts for each category (you'll need to implement this API)
  useEffect(() => {
    fetchPostCounts();
  }, [categories]);

  const fetchPostCounts = async () => {
    try {
      const response = await fetch("/api/admin/categories/post-counts");
      if (response.ok) {
        const data = await response.json();
        setPostCounts(data);
      }
    } catch (error) {
      console.error("Error fetching post counts:", error);
    }
  };

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
          <h3 className="font-semibold text-slate-800">Content Categories</h3>
          <p className="text-sm text-slate-500 mt-1">
            Organize your content with categories
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none w-full sm:w-48"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <i className="fa-solid fa-search text-slate-400 text-sm"></i>
            </div>
          </div>
          <button
            onClick={onNewCategory}
            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            New Category
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Slug</th>
              <th className="px-6 py-3">Posts</th>
              <th className="px-6 py-3">Created</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  <i className="fa-regular fa-folder-open text-3xl mb-3 block"></i>
                  <p>No categories found</p>
                  {searchTerm ? (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="mt-4 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
                    >
                      Clear Search
                    </button>
                  ) : (
                    <button
                      onClick={onNewCategory}
                      className="mt-4 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
                    >
                      <i className="fa-solid fa-plus mr-2"></i>
                      Create Your First Category
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              categories.map((category) => {
                const { icon, color, bgColor } = getCategoryIcon(category.name);
                const postCount = postCounts[category._id] || 0;

                return (
                  <tr
                    key={category._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-lg ${bgColor} ${color} flex items-center justify-center mr-3`}
                        >
                          <i className={`fa-solid ${icon} text-sm`}></i>
                        </div>
                        <div>
                          <span className="font-medium text-slate-900">
                            {category.name}
                          </span>
                          {category.description && (
                            <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <code className="text-xs bg-slate-50 px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {postCount} {postCount === 1 ? "post" : "posts"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900">
                        {formatDate(category.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onEditCategory(category)}
                          className="text-slate-400 hover:text-primary-600 p-1.5 rounded-lg hover:bg-primary-50 transition-colors"
                          title="Edit"
                        >
                          <i className="fa-solid fa-pen text-sm"></i>
                        </button>
                        <button
                          onClick={() => {
                            if (postCount > 0) {
                              if (
                                confirm(
                                  `This category has ${postCount} posts. Deleting it will remove the category from all ${postCount} posts. Are you sure you want to delete?`
                                )
                              ) {
                                onDeleteCategory(category);
                              }
                            } else {
                              onDeleteCategory(category);
                            }
                          }}
                          className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <i className="fa-solid fa-trash text-sm"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {categories.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-200">
          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-700">
              {categories.length}
            </span>{" "}
            categories
          </div>
        </div>
      )}
    </div>
  );
}
