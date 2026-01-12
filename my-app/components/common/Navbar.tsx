"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react"; // 1. Import Auth hooks

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession(); // 2. Get session and status

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Blogs", href: "/blogs" },
    { name: "Write for Us", href: "/write-for-us" },
  ];

  return (
    <nav className="sticky top-0 z-100 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <Link href="/" className="shrink-0 flex items-center cursor-pointer">
            <div className="w-8 h-8 bg-linear-to-br from-indigo-600 to-indigo-500 rounded-lg flex items-center justify-center text-white mr-2 shadow-md">
              <i className="fa-solid fa-feather-pointed"></i>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Lumina
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors text-sm ${
                  isActive(link.href)
                    ? "text-indigo-600 font-medium"
                    : "text-slate-600 hover:text-indigo-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {status === "loading" ? (
              /* 3. Loading State with Spinner */
              <button
                disabled
                className="bg-indigo-400 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center"
              >
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Checking...
              </button>
            ) : session ? (
              /* 4. Logged In State */
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-600">
                  Hi, {session.user?.name?.split(" ")[0]}
                </span>
                {session.user && (session.user as any).role === "admin" && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="text-slate-600 hover:text-red-600 text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              /* 5. Logged Out State */
              <Link
                href="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                Log in
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              <i
                className={`fa-solid ${
                  mobileMenuOpen ? "fa-xmark" : "fa-bars"
                } text-xl`}
              ></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 absolute w-full animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50"
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-slate-100 my-2 pt-2">
              {status === "loading" ? (
                <div className="px-3 py-2 text-slate-400 text-sm">
                  Loading session...
                </div>
              ) : session ? (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-indigo-600"
                  >
                    Admin Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
