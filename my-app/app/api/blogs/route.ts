import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";
import { GuestPost } from "@/models/GuestPost";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const category = searchParams.get("category");
    const limit = 6;

    // 1. Build query objects
    let blogQuery: any = { status: "published" };
    let guestQuery: any = { status: "published" };

    // 2. Apply category filter logic
    if (category && category !== "All") {
      blogQuery.categoryId = category;
      guestQuery.category = category;
    }

    // 3. Fetch from both collections simultaneously
    const [adminBlogs, approvedGuestPosts] = await Promise.all([
      Blog.find(blogQuery).lean(),
      GuestPost.find(guestQuery).lean(),
    ]);

    // 4. Normalize Data including the SLUG
    const normalizedAdmin = adminBlogs.map((post: any) => ({
      _id: post._id,
      articleTitle: post.title,
      articleContent: post.content,
      image: post.featuredImage,
      category: post.categoryId,
      slug: post.slug, // Added slug for Admin
      name: "Admin",
      createdAt: post.createdAt,
      type: "admin",
    }));

    const normalizedGuest = approvedGuestPosts.map((post: any) => ({
      _id: post._id,
      articleTitle: post.articleTitle,
      articleContent: post.articleContent,
      image: post.image,
      category: post.category,
      slug: post.slug, // Added slug for Guest
      name: post.name,
      createdAt: post.createdAt,
      type: "guest",
    }));

    console.log(normalizedGuest);
    
    // 5. Combine and Sort by Date (Newest first)
    const allPosts = [...normalizedAdmin, ...normalizedGuest].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // 6. Manual Pagination calculation
    const startIndex = (page - 1) * limit;
    const paginatedBlogs = allPosts.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(allPosts.length / limit);

    return NextResponse.json({
      blogs: paginatedBlogs,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}