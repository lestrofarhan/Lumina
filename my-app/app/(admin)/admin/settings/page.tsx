"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Mail,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";

// NOTE: We are creating a local "SimpleModal" here so we don't interfere with your BlogModal.tsx
const SimpleModal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-200">
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Password Modal States
  const [passModal, setPassModal] = useState(false);
  const [passData, setPassData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/admin/profile");
      const data = await res.json();
      setProfile({ name: data.name, email: data.email });
    } catch (err) {
      console.error("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (err) {
      setMessage({ type: "error", text: "Update failed" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.new !== passData.confirm)
      return alert("Passwords do not match");

    setPassLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passData),
      });
      if (res.ok) {
        setPassModal(false);
        setPassData({ current: "", new: "", confirm: "" });
        alert("Password changed successfully!");
      } else {
        alert("Error changing password");
      }
    } finally {
      setPassLoading(false);
    }
  };

  if (loading)
    return <div className="p-10 text-slate-400">Loading admin settings...</div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 text-sm">
            Account & Security Management
          </p>
        </div>
        {message.text && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            <CheckCircle2 size={16} /> {message.text}
          </div>
        )}
      </div>

      <div className="grid gap-6">
        {/* Profile Info */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <User className="text-indigo-600" size={20} />
            <h2 className="font-bold text-slate-800">General Information</h2>
          </div>
          <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Admin Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Login Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                disabled={isSaving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all"
              >
                {isSaving && <Loader2 size={16} className="animate-spin" />}{" "}
                Save Settings
              </button>
            </div>
          </form>
        </div>

        {/* Password Security */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <ShieldCheck className="text-green-600" size={20} />
            <h2 className="font-bold text-slate-800">Security</h2>
          </div>
          <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-xl">
                <Lock size={20} className="text-slate-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Password</h4>
                <p className="text-sm text-slate-500">
                  Change your secret login key
                </p>
              </div>
            </div>
            <button
              onClick={() => setPassModal(true)}
              className="px-6 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-700 transition-all"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Local Modal for Settings - Keeps code isolated from BlogModal */}
      <SimpleModal
        isOpen={passModal}
        onClose={() => setPassModal(false)}
        title="Security Update"
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Old Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
              value={passData.current}
              onChange={(e) =>
                setPassData({ ...passData, current: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">
              New Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
              value={passData.new}
              onChange={(e) =>
                setPassData({ ...passData, new: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Confirm Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
              value={passData.confirm}
              onChange={(e) =>
                setPassData({ ...passData, confirm: e.target.value })
              }
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setPassModal(false)}
              className="flex-1 py-2 font-bold text-slate-500 bg-slate-50 rounded-xl"
            >
              Cancel
            </button>
            <button
              disabled={passLoading}
              className="flex-1 py-2 font-bold text-white bg-indigo-600 rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              {passLoading && <Loader2 size={16} className="animate-spin" />}{" "}
              Confirm
            </button>
          </div>
        </form>
      </SimpleModal>
    </div>
  );
}
