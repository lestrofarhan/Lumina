"use client";

import { usePathname } from "next/navigation";
import { Bell, Plus } from "lucide-react";

export default function AdminHeader() {
  const pathname = usePathname();

  const getHeaderInfo = () => {
    if (pathname === "/admin")
      return { title: "Dashboard Overview", showBtn: null };
    if (pathname.includes("/admin/blogs"))
      // Fixed path check
      return {
        title: "Blog Management",
        showBtn: "open-blog-modal", // This is the Event Name
        label: "New Post",
      };
    if (pathname.includes("/admin/categories"))
      return {
        title: "Category Management",
        showBtn: "open-category-modal",
        label: "Add Category",
      };
    if (pathname.includes("/admin/settings"))
      return { title: "Settings", showBtn: null };

    return { title: "Admin Panel", showBtn: null };
  };

  const { title, showBtn, label } = getHeaderInfo();

  // This function sends a "signal" that the pages can listen for
  const handleAction = () => {
    if (showBtn) {
      window.dispatchEvent(new Event(showBtn));
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30">
      <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
        {title}
      </h2>

      <div className="flex items-center space-x-4">
      

        {showBtn && (
          <button
            onClick={handleAction}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95"
          >
            <Plus size={18} className="mr-1.5" />
            {label}
          </button>
        )}
      </div>
    </header>
  );
}
