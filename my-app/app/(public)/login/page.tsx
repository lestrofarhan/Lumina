"use client";

import { useState } from "react";
import { signIn } from "next-auth/react"; // NextAuth function to trigger the login flow
import { useRouter } from "next/navigation"; // To redirect the user after login
import toast, { Toaster } from "react-hot-toast"; // For beautiful popup notifications
import { Lock, Mail, Loader2 } from "lucide-react"; // Icons for the UI

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 1. Local state to capture input values
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 2. The signIn function calls the 'Credentials' provider in your [...nextauth]/route.ts
    // redirect: false prevents the page from refreshing so we can handle errors with toasts
    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      // 3. If NextAuth returns an error (wrong password, user not found), show a toast
      toast.error(res.error);
      setIsLoading(false);
    } else {
      // 4. Successful login: Notify user, refresh the session, and redirect to Admin
      toast.success("Login successful! Redirecting...");
      router.push("/admin");
      router.refresh(); // Forces Next.js to re-check the session status in the Navbar
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      {/* 5. Toaster component must be present for toast.success/error to show up */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-md mb-4">
            <i className="fa-solid fa-feather-pointed text-xl"></i>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Access the Lumina Management Dashboard
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* EMAIL INPUT */}
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                placeholder="Admin Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* PASSWORD INPUT */}
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

        

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative cursor-pointer w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLoading ? (
                  <Loader2 className="animate-spin text-white" size={18} />
                ) : (
                  <Lock
                    className="text-indigo-300 group-hover:text-white transition-colors"
                    size={18}
                  />
                )}
              </span>
              {isLoading ? "Signing in..." : "Sign in to Dashboard"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
