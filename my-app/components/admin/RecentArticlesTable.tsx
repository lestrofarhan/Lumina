"use client";

import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";

interface Article {
  _id: string;
  title: string;
  author: string; // Updated from authorName
  status: string;
  createdAt: string;
  type: "Admin" | "Guest"; // Added to handle different modal types
}

interface TableProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (article: Article) => void;
}

export function RecentArticlesTable({
  articles,
  onEdit,
  onDelete,
}: TableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800">Recent Articles</h3>
        <Link
          href="/admin/blogs"
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Author</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {articles?.map((article) => (
              <tr
                key={article._id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-900 truncate max-w-xs">
                  <div className="flex flex-col">
                    <span>{article.title}</span>
                    <span
                      className={`text-[10px] font-bold uppercase w-fit px-1 rounded ${
                        article.type === "Admin"
                          ? "bg-indigo-50 text-indigo-600"
                          : "bg-orange-50 text-orange-600"
                      }`}
                    >
                      {article.type}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">{article.author}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      article.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {new Date(article.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right flex justify-end space-x-2">
                  <button
                    onClick={() => onEdit(article)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(article)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
