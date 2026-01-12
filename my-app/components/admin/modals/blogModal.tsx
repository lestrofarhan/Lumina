// components/admin/BlogModal.tsx
import { useState, useEffect } from "react";
import { Blog, Category } from "@/types";

interface BlogModalProps {
  type: "new-blog" | "edit-blog";
  blog?: Blog | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSave: () => void;
}

export default function BlogModal({
  type,
  blog,
  categories,
  isOpen,
  onClose,
  currentStep,
  onNextStep,
  onPrevStep,
  onSave,
}: BlogModalProps) {

  console.log(blog);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    categoryId: "",
    status: "draft",
    tags: "",
    content: "",
    excerpt: "",
    featuredImage: null as File | null,
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        categoryId: blog.categoryId || "",
        status: blog.status || "draft",
        tags: blog.tags?.join(", ") || "",
        content: blog.content || "",
        excerpt: "",
        featuredImage: null,
        metaTitle: blog.metaTitle || "",
        metaDescription: blog.metaDescription || "",
      });
    }
  }, [blog]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, featuredImage: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && key !== "featuredImage") {
          formDataToSend.append(key, value as string);
        }
      });

      if (formData.featuredImage) {
        formDataToSend.append("image", formData.featuredImage);
      }

      const url =
        type === "new-blog"
          ? "/api/admin/blogs"
          : `/api/admin/blogs/${blog?._id}`;

      const method = type === "new-blog" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        onSave();
        onClose();
      }
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  if (!isOpen) return null;

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
          <div>
            <h3 className="text-lg font-bold text-white">
              {type === "new-blog" ? "Create New Blog Post" : "Edit Blog Post"}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Step {currentStep} of 4
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="bg-slate-100 h-1">
          <div
            className="bg-primary-600 h-full transition-all duration-300"
            style={{ width: `${currentStep * 25}%` }}
          ></div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Step 1: Main Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Blog Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  placeholder="Enter your blog title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-slate-50"
                  placeholder="auto-generated-slug"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  placeholder="react, javascript, web-dev"
                />
              </div>
            </div>
          )}

          {/* Step 2: Content */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Article Content
                </label>
                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-300 px-3 py-2 flex space-x-2">
                    <button className="p-1.5 hover:bg-slate-200 rounded text-slate-600">
                      <i className="fa-solid fa-bold"></i>
                    </button>
                    <button className="p-1.5 hover:bg-slate-200 rounded text-slate-600">
                      <i className="fa-solid fa-italic"></i>
                    </button>
                    <button className="p-1.5 hover:bg-slate-200 rounded text-slate-600">
                      <i className="fa-solid fa-list"></i>
                    </button>
                    <button className="p-1.5 hover:bg-slate-200 rounded text-slate-600">
                      <i className="fa-solid fa-link"></i>
                    </button>
                  </div>
                  <textarea
                    rows={12}
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="w-full px-4 py-3 focus:outline-none resize-none"
                    placeholder="Write your article content here..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Excerpt
                </label>
                <textarea
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  placeholder="Brief summary of your article"
                />
              </div>
            </div>
          )}

          {/* Step 3: Media */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Featured Image
                </label>
                <label className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer block">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <i className="fa-solid fa-cloud-arrow-up text-4xl text-slate-400 mb-3"></i>
                  <p className="text-sm text-slate-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-400">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </label>
              </div>
              {formData.featuredImage && (
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-slate-200 rounded mr-3 flex items-center justify-center">
                        <i className="fa-solid fa-image text-slate-400"></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {formData.featuredImage.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(formData.featuredImage.size / 1024 / 1024).toFixed(
                            2
                          )}{" "}
                          MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setFormData({ ...formData, featuredImage: null })
                      }
                      className="text-red-600 hover:text-red-700"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: SEO */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, metaTitle: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  placeholder="SEO optimized title"
                />
                <p className="text-xs text-slate-500 mt-1">
                  60 characters recommended
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metaDescription: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  placeholder="Brief description for search engines"
                />
                <p className="text-xs text-slate-500 mt-1">
                  160 characters recommended
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 mb-2">
                  GOOGLE PREVIEW
                </p>
                <div className="text-primary-600 text-lg mb-1 truncate">
                  {formData.metaTitle || formData.title}
                </div>
                <div className="text-green-700 text-xs mb-1 truncate">
                  https://lumina.com/blog/{formData.slug}
                </div>
                <div className="text-slate-600 text-sm truncate">
                  {formData.metaDescription ||
                    "Your meta description will appear here..."}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 px-6 py-4 flex justify-between">
          <button
            onClick={onPrevStep}
            className={`px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors ${
              currentStep === 1 ? "invisible" : ""
            }`}
          >
            <i className="fa-solid fa-arrow-left mr-2"></i> Back
          </button>
          <div className="ml-auto flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={currentStep < 4 ? onNextStep : handleSubmit}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
            >
              {currentStep < 4 ? (
                <>
                  Next <i className="fa-solid fa-arrow-right ml-2"></i>
                </>
              ) : type === "new-blog" ? (
                "Publish"
              ) : (
                "Update"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
