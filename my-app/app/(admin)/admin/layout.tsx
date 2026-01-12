// app/admin/layout.tsx
import AdminSidebar from "@/components/admin/sidebar";
import AdminHeader from "@/components/admin/header";
import Navbar from "@/components/common/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
      <div>
        <Navbar />
        <div className="flex min-h-screen bg-slate-50">
          {/* 1. Sidebar stays on the left */}
          <AdminSidebar />

          {/* 2. Content area on the right */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Dynamic Header */}
            <AdminHeader />

            {/* Main Page Content */}
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    );
}
