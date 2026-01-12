// app/api/admin/categories/post-counts/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";
import { GuestPost } from "@/models/GuestPost";
import { Category } from "@/models/Category";

export async function GET() {
  try {
    await connectDB();

    // Get all categories
    const categories = await Category.find().lean();

    // Get blog post counts by category
    const blogCounts = await Blog.aggregate([
      { $match: { status: "published" } },
      { $group: { _id: "$categoryId", count: { $sum: 1 } } },
    ]);

    // Get guest post counts by category (approved or published)
    const guestPostCounts = await GuestPost.aggregate([
      { $match: { status: { $in: ["approved", "published"] } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // Combine counts
    const postCounts: Record<string, number> = {};

    // Initialize all categories with 0
    categories.forEach((category) => {
      postCounts[category._id.toString()] = 0;
      // Also map by category name for guest posts
      postCounts[category.name] = 0;
    });

    // Add blog counts
    blogCounts.forEach(({ _id, count }) => {
      if (_id && postCounts[_id] !== undefined) {
        postCounts[_id] += count;
      }
    });

    // Add guest post counts
    guestPostCounts.forEach(({ _id, count }) => {
      if (_id && postCounts[_id] !== undefined) {
        postCounts[_id] += count;
      }
    });

    return NextResponse.json(postCounts);
  } catch (error: any) {
    console.error("Error fetching post counts:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
