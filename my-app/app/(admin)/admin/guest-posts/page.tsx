// app/admin/guest-posts/page.tsx
"use client";

import { useState, useEffect } from "react";
import GuestPostsTable from "@/components/admin/guestPostTable";
import ViewGuestPostModal from "@/components/admin/modals/viewGuestPostModal";
import DeleteModal from "@/components/admin/modals/deleteModal";
import ApproveModal from "@/components/admin/modals/approveModal";
import { GuestPost } from "@/types";

export default function GuestPostsPage() {
  const [guestPosts, setGuestPosts] = useState<GuestPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<GuestPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<GuestPost | null>(null);
  const [modalType, setModalType] = useState<
    | "view-guest-post"
    | "approve-guest-post"
    | "reject-guest-post"
    | "delete-guest-post"
    | null
  >(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch guest posts
  useEffect(() => {
    fetchGuestPosts();
  }, []);

  // Filter posts when status filter or search changes
  useEffect(() => {
    let filtered = guestPosts;

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((post) => post.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.articleTitle.toLowerCase().includes(term) ||
          post.name.toLowerCase().includes(term) ||
          post.email.toLowerCase().includes(term) ||
          (post.category && post.category.toLowerCase().includes(term))
      );
    }

    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [guestPosts, statusFilter, searchTerm]);

  const fetchGuestPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/guest-posts");
      if (response.ok) {
        const data = await response.json();
        setGuestPosts(data.guestPosts || []);
      }
    } catch (error) {
      console.error("Error fetching guest posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: typeof modalType, post?: GuestPost) => {
    setModalType(type);
    if (post) {
      setSelectedPost(post);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedPost(null);
  };

  const handleApprove = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/guest-posts/${postId}/approve`, {
        method: "PUT",
      });

      if (response.ok) {
        // Update the post status locally
        setGuestPosts((posts) =>
          posts.map((post) =>
            post._id === postId ? { ...post, status: "approved" } : post
          )
        );
        closeModal();
      }
    } catch (error) {
      console.error("Error approving guest post:", error);
    }
  };

  const handlePublish = async (postId: string) => {
    try {
      // First approve, then publish (convert to blog)
      const response = await fetch(`/api/admin/guest-posts/${postId}/approve`, {
        method: "PUT",
      });

      if (response.ok) {
        // Remove from guest posts since it's now published as a blog
        setGuestPosts((posts) => posts.filter((post) => post._id !== postId));
        closeModal();
      }
    } catch (error) {
      console.error("Error publishing guest post:", error);
    }
  };

  const handleReject = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/guest-posts/${postId}/reject`, {
        method: "PUT",
      });

      if (response.ok) {
        // Update the post status locally
        setGuestPosts((posts) =>
          posts.map((post) =>
            post._id === postId ? { ...post, status: "rejected" } : post
          )
        );
        closeModal();
      }
    } catch (error) {
      console.error("Error rejecting guest post:", error);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/guest-posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from list
        setGuestPosts((posts) => posts.filter((post) => post._id !== postId));
        closeModal();
      }
    } catch (error) {
      console.error("Error deleting guest post:", error);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Get status badge color
  const getStatusColor = (status: GuestPost["status"]) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-700";
      case "approved":
        return "bg-blue-100 text-blue-700";
      case "published":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
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
      {/* Guest Posts Table */}
      <GuestPostsTable
        guestPosts={paginatedPosts}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalPosts={filteredPosts.length}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        onView={(post) => openModal("view-guest-post", post)}
        onApprove={(post) => openModal("approve-guest-post", post)}
        onReject={(post) => openModal("reject-guest-post", post)}
        onDelete={(post) => openModal("delete-guest-post", post)}
        onPublish={handlePublish}
        getStatusColor={getStatusColor}
      />

      {/* Modals */}
      {modalType === "view-guest-post" && selectedPost && (
        <ViewGuestPostModal
          post={selectedPost}
          isOpen={true}
          onClose={closeModal}
          onApprove={() => handleApprove(selectedPost._id)}
          onReject={() => handleReject(selectedPost._id)}
        />
      )}

      {modalType === "approve-guest-post" && selectedPost && (
        <ApproveModal
          isOpen={true}
          onClose={closeModal}
          onConfirm={() => handleApprove(selectedPost._id)}
          title="Approve Guest Post"
          message="This guest post will be approved. The author will be notified."
        />
      )}

      {modalType === "reject-guest-post" && selectedPost && (
        <DeleteModal
          type="reject-guest-post"
          isOpen={true}
          onClose={closeModal}
          onConfirm={() => handleReject(selectedPost._id)}
          title="Reject Guest Post"
          message="This guest post will be rejected. The author will be notified."
        />
      )}

      {modalType === "delete-guest-post" && selectedPost && (
        <DeleteModal
          type="delete-guest-post"
          isOpen={true}
          onClose={closeModal}
          onConfirm={() => handleDelete(selectedPost._id)}
          title="Delete Guest Post"
          message="This action cannot be undone. The guest post will be permanently deleted."
        />
      )}
    </div>
  );
}
