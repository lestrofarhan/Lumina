"use client";

import { useEffect, useState, useCallback } from "react";
import { Eye, FileText, Clock } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { RecentArticlesTable } from "@/components/admin/RecentArticlesTable";
import BlogModal from "@/components/admin/modals/blogModal";
import DeleteModal from "@/components/admin/modals/deleteModal";
import {
  StatSkeleton,
  TableSkeleton,
} from "@/components/skeleton/DashboardSkeleton";
import { Blog, Category } from "@/types";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Modal & Selection States (Matched with AdminBlogsPage) ---
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [modalType, setModalType] = useState<
    "edit-blog" | "delete-blog" | "reject-guest-post" | null
  >(null);
  const [currentStep, setCurrentStep] = useState(1);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, catRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/categories"),
      ]);

      const statsJson = await statsRes.json();
      const catJson = await catRes.json();

      setData(statsJson);
      setCategories(catJson || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // --- Handlers ---
  const openModal = (type: any, item: any) => {
    setModalType(type);
    if (item.type === "Admin") {
      setSelectedBlog(item);
    } else {
      // If it's a guest post, we treat it for deletion/rejection
      setSelectedBlog(item);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedBlog(null);
    setCurrentStep(1);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBlog) return;

    const endpoint =
      selectedBlog.type === "Admin"
        ? `/api/admin/blogs/${selectedBlog._id}`
        : `/api/admin/guest-posts/${selectedBlog._id}/reject`;

    const response = await fetch(endpoint, {
      method: selectedBlog.type === "Admin" ? "DELETE" : "PUT",
    });

    if (response.ok) {
      await fetchDashboardData();
      closeModal();
    }
  };

  return (
    <div className="space-y-8 p-4 animate-in fade-in duration-500">
      {/* STAT CARDS */}
      {!loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Views"
            value={data?.stats?.totalViews?.toLocaleString() || "0"}
            icon={Eye}
            colorClass="bg-blue-50 text-blue-600"
          />
          <StatCard
            title="Active Posts"
            value={data?.stats?.activePosts || "0"}
            icon={FileText}
            colorClass="bg-purple-50 text-purple-600"
          />
          <StatCard
            title="Pending Guests"
            value={data?.stats?.pendingGuests || "0"}
            icon={Clock}
            colorClass="bg-orange-50 text-orange-600"
          />
        </div>
      ) : (
        <StatSkeleton />
      )}

      {/* RECENT ARTICLES TABLE */}
      {!loading ? (
        <RecentArticlesTable
          articles={data?.recentArticles}
          onEdit={(item) => {
            if (item.type === "Admin") {
              openModal("edit-blog", item);
            } else {
              alert("Guest posts must be edited from the Guest Requests page.");
            }
          }}
          onDelete={(item) => openModal("delete-blog", item)}
        />
      ) : (
        <TableSkeleton />
      )}

      {/* --- MODALS --- */}

      {/* Edit Blog Modal */}
      {modalType === "edit-blog" && selectedBlog && (
        <BlogModal
          type="edit-blog"
          blog={selectedBlog}
          categories={categories}
          isOpen={true}
          onClose={closeModal}
          currentStep={currentStep}
          onNextStep={() => setCurrentStep((prev) => Math.min(prev + 1, 4))}
          onPrevStep={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
          onSave={fetchDashboardData}
        />
      )}

      {/* Delete Confirmation Modal */}
      {(modalType === "delete-blog" || modalType === "reject-guest-post") && (
        <DeleteModal
          type={modalType}
          isOpen={true}
          onClose={closeModal}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
