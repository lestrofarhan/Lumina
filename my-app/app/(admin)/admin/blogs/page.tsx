"use client";

import { useState, useEffect, useCallback } from "react";
import BlogTable from "@/components/admin/blogTable";
import BlogModal from "@/components/admin/modals/blogModal";
import CategoryModal from "@/components/admin/modals/categoryModal";
import DeleteModal from "@/components/admin/modals/deleteModal";
import ViewGuestPostModal from "@/components/admin/modals/viewGuestPostModal";
import BlogTableSkeleton from "@/components/skeleton/blogTableSkeleton";
import { Blog, GuestPost, Category } from "@/types";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [guestPosts, setGuestPosts] = useState<GuestPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection States
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [selectedGuestPost, setSelectedGuestPost] = useState<GuestPost | null>(
    null
  );
  const [modalType, setModalType] = useState<
    | "new-blog"
    | "edit-blog"
    | "new-category"
    | "edit-category"
    | "delete-blog"
    | "view-guest-post"
    | "reject-guest-post"
    | null
  >(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 1. Fetch Data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [blogsRes, guestPostsRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/blogs").then((res) => res.json()),
        fetch("/api/admin/guest-posts").then((res) => res.json()),
        fetch("/api/categories").then((res) => res.json()),
      ]);

      setBlogs(blogsRes.blogs || []);
      setGuestPosts(guestPostsRes.guestPosts || []);
      setCategories(categoriesRes || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 2. Modal Handlers
  const openModal = (type: typeof modalType, data?: any) => {
    setModalType(type);
    if (type === "edit-blog" || type === "delete-blog") setSelectedBlog(data);
    if (type === "view-guest-post" || type === "reject-guest-post")
      setSelectedGuestPost(data);
    if (type === "new-blog") setCurrentStep(1);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedBlog(null);
    setSelectedGuestPost(null);
    setCurrentStep(1);
  };

  // 3. Action Handlers
  const handleDeleteBlog = async (id: string) => {
    const response = await fetch(`/api/admin/blogs/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      closeModal();
    }
  };

  const handleApproveGuestPost = async (id: string) => {
    const response = await fetch(`/api/admin/guest-posts/${id}/approve`, {
      method: "PUT",
    });
    if (response.ok) {
      fetchData(); // Refresh everything because a guest post is now a blog
      closeModal();
    }
  };

  const handleRejectGuestPost = async (id: string) => {
    const response = await fetch(`/api/admin/guest-posts/${id}/reject`, {
      method: "PUT",
    });
    if (response.ok) {
      setGuestPosts((prev) => prev.filter((p) => p._id !== id));
      closeModal();
    }
  };

  // 4. Filtering Logic
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <BlogTableSkeleton />;

  return (
    <div className="p-6">
      <BlogTable
        blogs={paginatedBlogs}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalBlogs={filteredBlogs.length}
        onEdit={(blog) => openModal("edit-blog", blog)}
        onDelete={(blog) => openModal("delete-blog", blog)}
      />

      {/* --- MODALS --- */}

      {/* Blog Modal (Create/Edit) */}
      {(modalType === "new-blog" || modalType === "edit-blog") && (
        <BlogModal
          type={modalType}
          blog={selectedBlog}
          categories={categories}
          isOpen={true}
          onClose={closeModal}
          currentStep={currentStep}
          onNextStep={() => setCurrentStep((prev) => Math.min(prev + 1, 4))}
          onPrevStep={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
          onSave={fetchData}
        />
      )}

      {/* Category Modal */}
      {(modalType === "new-category" || modalType === "edit-category") && (
        <CategoryModal
          type={modalType}
          isOpen={true}
          onClose={closeModal}
          onSave={fetchData}
        />
      )}

      {/* Guest Post View/Approve */}
      {modalType === "view-guest-post" && (
        <ViewGuestPostModal
          post={selectedGuestPost}
          isOpen={true}
          onClose={closeModal}
          onApprove={() =>
            selectedGuestPost && handleApproveGuestPost(selectedGuestPost._id)
          }
          onReject={() => openModal("reject-guest-post", selectedGuestPost)}
        />
      )}

      {/* Delete/Reject Confirmation */}
      {(modalType === "delete-blog" || modalType === "reject-guest-post") && (
        <DeleteModal
          type={modalType}
          isOpen={true}
          onClose={closeModal}
          onConfirm={() => {
            if (modalType === "delete-blog" && selectedBlog)
              handleDeleteBlog(selectedBlog._id);
            if (modalType === "reject-guest-post" && selectedGuestPost)
              handleRejectGuestPost(selectedGuestPost._id);
          }}
        />
      )}
    </div>
  );
}
