// app/admin/categories/page.tsx
"use client";

import { useState, useEffect } from "react";
import CategoriesTable from "@/components/admin/categoriesTable";
import CategoryModal from "@/components/admin/modals/categoryModal";
import DeleteModal from "@/components/admin/modals/deleteModal";
import { Category } from "@/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [modalType, setModalType] = useState<
    "new-category" | "edit-category" | "delete-category" | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: typeof modalType, category?: Category) => {
    setModalType(type);
    if (category) {
      setSelectedCategory(category);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedCategory(null);
  };

  const handleDelete = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCategories(categories.filter((cat) => cat._id !== categoryId));
        closeModal();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleSave = async (categoryData: Partial<Category>) => {
    try {
      const url =
        modalType === "new-category"
          ? "/api/admin/categories"
          : `/api/admin/categories/${selectedCategory?._id}`;

      const method = modalType === "new-category" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        fetchCategories(); // Refresh list
        closeModal();
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get icon and color for each category
  const getCategoryIcon = (categoryName: string) => {
    const icons: Record<
      string,
      { icon: string; color: string; bgColor: string }
    > = {
      technology: {
        icon: "fa-code",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      design: {
        icon: "fa-pen-nib",
        color: "text-purple-600",
        bgColor: "bg-purple-100",
      },
      business: {
        icon: "fa-chart-line",
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
      marketing: {
        icon: "fa-bullhorn",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
      },
      lifestyle: {
        icon: "fa-heart-pulse",
        color: "text-pink-600",
        bgColor: "bg-pink-100",
      },
      development: {
        icon: "fa-laptop-code",
        color: "text-indigo-600",
        bgColor: "bg-indigo-100",
      },
      productivity: {
        icon: "fa-rocket",
        color: "text-cyan-600",
        bgColor: "bg-cyan-100",
      },
      health: {
        icon: "fa-heart",
        color: "text-red-600",
        bgColor: "bg-red-100",
      },
      education: {
        icon: "fa-graduation-cap",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      },
    };

    const key = categoryName.toLowerCase();
    return (
      icons[key] || {
        icon: "fa-folder",
        color: "text-slate-600",
        bgColor: "bg-slate-100",
      }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Categories Table */}
      <CategoriesTable
        categories={filteredCategories}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onNewCategory={() => openModal("new-category")}
        onEditCategory={(category) => openModal("edit-category", category)}
        onDeleteCategory={(category) => openModal("delete-category", category)}
        getCategoryIcon={getCategoryIcon}
      />

      {/* Modals */}
      {modalType === "new-category" || modalType === "edit-category" ? (
        <CategoryModal
          type={modalType}
          category={selectedCategory}
          isOpen={true}
          onClose={closeModal}
          onSave={handleSave}
        />
      ) : null}

      {modalType === "delete-category" && selectedCategory ? (
        <DeleteModal
          type="delete-category"
          isOpen={true}
          onClose={closeModal}
          onConfirm={() => handleDelete(selectedCategory._id)}
        />
      ) : null}
    </div>
  );
}
