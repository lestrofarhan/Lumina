"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Search, ChevronDown, CheckCircle2, Send } from "lucide-react";
import dynamic from "next/dynamic";
import toast, { Toaster } from "react-hot-toast";

// Load Editor dynamically
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const CATEGORIES = [
  "AI",
  "Business",
  "Design",
  "Marketing",
  "Software",
  "Technology",
].sort();

export default function WriteForUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    articleTitle: "",
    category: "",
    backlink: "",
    anchorText: "",
  });

  const [articleContent, setArticleContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categorySearch, setCategorySearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dbCategories, setDbCategories] = useState([]);

  const inputClasses =
    "w-full px-4 py-2 rounded-lg border border-slate-300 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

 



    // 1. Fetch categories on mount
    useEffect(() => {
      const fetchCats = async () => {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setDbCategories(data.map((c: any) => c.name)); // Just get the names
      };
      fetchCats();
    }, []);


    // 2. Use dbCategories instead of the old hardcoded CATEGORIES array
    const filteredCategories = useMemo(() => {
      return dbCategories.filter((cat: any) =>
        cat.toLowerCase().includes(categorySearch.toLowerCase())
        );
        
    }, [categorySearch, dbCategories]);

    
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      toast.success("Image selected!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.articleTitle ||
      !articleContent
    ) {
      toast.error("Please fill in all required fields!");
      return;
    }

    setIsSubmitting(true);

const data = new FormData();

data.append("name", formData.name);
data.append("email", formData.email);
data.append("website", formData.website);
data.append("articleTitle", formData.articleTitle);
data.append("category", formData.category);
data.append("backlink", formData.backlink);
data.append("anchorText", formData.anchorText);
data.append("articleContent", articleContent); // This sends the HTML from Quill

if (imageFile) {
  data.append("image", imageFile);
}

    const submissionPromise = fetch("/api/guest-post", {
      method: "POST",
      body: data,
    }).then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit");
      }
      return res.json();
    });

    toast.promise(submissionPromise, {
      loading: "Uploading image and saving to database...",
      success: () => {
        setIsSubmitted(true);
        return <b>Post submitted successfully!</b>;
      },
      error: (err) => <b>Error: {err.message}</b>,
    });

      setIsSubmitting(false);
  };

  
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <Toaster />
        <div className="text-center p-12 bg-white rounded-3xl shadow-xl max-w-md border border-slate-100">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Success!</h2>
          <p className="text-slate-600 mb-8">
            Your post is now pending review.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-blue-600 font-semibold hover:underline"
          >
            Submit another post
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 px-8 py-10 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Submit a Guest Post
            </h1>
            <p className="text-slate-300 text-lg">
              Share your expertise with our readers.
            </p>
          </div>

          <div className="p-8 md:p-12">
            <div className="mb-10 bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center">
                <i className="fa-solid fa-circle-info mr-2"></i> Submission
                Guidelines
              </h3>
              <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                <li>Content must be original and not published elsewhere.</li>
                <li>Minimum word count: 800 words.</li>
                <li>Include relevant images and proper attribution.</li>
                <li>We allow 1 do-follow link in the author bio.</li>
              </ul>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    className={inputClasses}
                    placeholder="John Doe"
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    className={inputClasses}
                    placeholder="john@example.com"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Article Title *
                </label>
                <input
                  required
                  type="text"
                  className={inputClasses}
                  placeholder="e.g. 10 Tips for Better Performance"
                  onChange={(e) =>
                    setFormData({ ...formData, articleTitle: e.target.value })
                  }
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className={inputClasses}
                      placeholder="Search categories..."
                      value={categorySearch}
                      onFocus={() => setShowDropdown(true)}
                      onBlur={() =>
                        setTimeout(() => setShowDropdown(false), 200)
                      }
                      onChange={(e) => setCategorySearch(e.target.value)}
                    />
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                  </div>
                  {showDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                      {filteredCategories.map((cat) => (
                        <div
                          key={cat}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-slate-700"
                          onMouseDown={() => {
                            setFormData({ ...formData, category: cat });
                            setCategorySearch(cat);
                          }}
                        >
                          {cat}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Website URL (Optional)
                  </label>
                  <input
                    type="url"
                    className={inputClasses}
                    placeholder="https://yourwebsite.com"
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Cover Image
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center relative hover:bg-blue-50/30 transition-colors cursor-pointer group focus-within:border-blue-500">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      className="h-40 w-full object-cover rounded-lg"
                      alt="Preview"
                    />
                  ) : (
                    <div className="text-center py-2 text-slate-500 group-hover:text-blue-500">
                      <p className="text-sm">Click to upload cover photo</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Backlink URL
                  </label>
                  <input
                    type="url"
                    className={inputClasses}
                    placeholder="https://yourlink.com"
                    onChange={(e) =>
                      setFormData({ ...formData, backlink: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Anchor Text
                  </label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="Click Here"
                    onChange={(e) =>
                      setFormData({ ...formData, anchorText: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Article Content *
                </label>
                <div className="h-80 mb-12">
                  <ReactQuill
                    theme="snow"
                    value={articleContent}
                    onChange={setArticleContent}
                    className="h-64 rounded-xl focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer  bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center group"
                >
                  <span>
                    {isSubmitting ? "Processing..." : "Submit for Review"}
                  </span>
                  {isSubmitting ? (
                    ""
                  ) : (
                    <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
