"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Newspaper,
  FileEdit,
  FolderTree,
  Settings,
  ChevronRight,
  ChevronLeft,
  LogOut,
  X,
} from "lucide-react";

export default function AdminSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // 1. Fetch the real pending count from your Stats API
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (data?.stats?.pendingGuests !== undefined) {
          setPendingCount(data.stats.pendingGuests);
        }
      } catch (error) {
        console.error("Failed to fetch sidebar notifications:", error);
      }
    };

    fetchPendingCount();
    // Optional: Refresh count every 2 minutes
    const interval = setInterval(fetchPendingCount, 120000);
    return () => clearInterval(interval);
  }, [pathname]); // Refresh when navigating

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "All Posts", href: "/admin/blogs", icon: Newspaper },
    {
      name: "Guest Requests",
      href: "/admin/guest-posts",
      icon: FileEdit,
      count: pendingCount, // Now dynamic
    },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`lg:hidden fixed bottom-6 right-6 z-[60] p-4 rounded-full shadow-2xl transition-all duration-300 ${
          isOpen ? "bg-red-500 rotate-180" : "bg-indigo-600"
        } text-white`}
      >
        {isOpen ? <X size={24} /> : <ChevronRight size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col
          lg:relative lg:translate-x-0 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              L
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Lumina Admin
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110 ${
                    active
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white"
                  }`}
                />
                <span className="font-medium tracking-wide">{link.name}</span>

                {/* 2. Enhanced Dynamic Badge */}
                {link.count   > 0 && (
                  <span
                    className={`ml-auto text-[11px] font-bold py-0.5 px-2 rounded-md relative flex items-center justify-center ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {/* Pulsing Dot for Attention */}
                    {!active && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                      </span>
                    )}
                    {link.count}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-800">
            <Link
              href="/admin/settings"
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                pathname === "/admin/settings"
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Settings className="w-5 h-5 mr-3 text-slate-400" />
              <span className="font-medium tracking-wide">Settings</span>
            </Link>
          </div>
        </nav>

        {/* Profile Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40 backdrop-blur-md">
          <div className="flex items-center p-2 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <img
              src={
                session?.user?.image ||
                `https://ui-avatars.com/api/?name=${
                  session?.user?.name || "Admin"
                }&background=4f46e5&color=fff`
              }
              alt="Admin"
              className="w-10 h-10 rounded-xl object-cover border border-slate-600"
            />
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {session?.user?.name || "Admin User"}
              </p>
              <p className="text-[11px] text-slate-500 truncate lowercase">
                {session?.user?.email || "admin@lumina.com"}
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="ml-2 p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
