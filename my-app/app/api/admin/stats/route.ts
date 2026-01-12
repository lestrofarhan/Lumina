import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";
import { GuestPost } from "@/models/GuestPost";
import { User } from "@/models/User"; // Ensure User model is imported for population

export async function GET() {
  try {
    await connectDB();

    // 1. Fetch Numerical Stats in parallel
    const [
      blogViews,
      guestViews,
      activeAdminPosts,
      activeGuestPosts,
      pendingGuestsCount,
    ] = await Promise.all([
      Blog.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
      GuestPost.aggregate([
        { $group: { _id: null, total: { $sum: "$views" } } },
      ]),
      Blog.countDocuments({ status: "published" }),
      GuestPost.countDocuments({ status: "published" }),
      GuestPost.countDocuments({ status: "pending" }),
    ]);

    // 2. Fetch Recent Articles
    // IMPORTANT: We use .populate("authorId") to get the Admin's name from the User model
    const [recentBlogs, recentGuests] = await Promise.all([
      Blog.find()
        .populate("authorId", "name") // Get only the name field from the User document
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      GuestPost.find().sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    // 3. Normalize Data with corrected Author logic
    const normalizedBlogs = recentBlogs.map((post: any) => ({
      _id: post._id,
      title: post.title,
      views: post.views || 0,
      status: post.status,
      createdAt: post.createdAt,
      image: post.featuredImage,
      // If authorId was populated, use the name, otherwise fallback to Admin
      author: post.authorId?.name || "Lumina Admin",
      type: "Admin",
    }));

    const normalizedGuests = recentGuests.map((post: any) => ({
      _id: post._id,
      title: post.articleTitle, // From GuestPost schema
      views: post.views || 0,
      status: post.status,
      createdAt: post.createdAt,
      image: post.image, // From GuestPost schema
      author: post.name, // From GuestPost schema 'name' field
      type: "Guest",
    }));

    // Combine and Sort
    const combinedArticles = [...normalizedBlogs, ...normalizedGuests]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 6);

    const totalViews = (blogViews[0]?.total || 0) + (guestViews[0]?.total || 0);

    return NextResponse.json({
      stats: {
        totalViews,
        activePosts: activeAdminPosts + activeGuestPosts,
        pendingGuests: pendingGuestsCount,
      },
      recentArticles: combinedArticles,
    });
  } catch (error: any) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
