// app/api/admin/guest-posts/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { GuestPost } from "@/models/GuestPost";

export async function GET() {
  try {
    await connectDB();

    // Fetch guest posts, newest first
    const guestPosts = await GuestPost.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ guestPosts });
  } catch (error: any) {
    console.error("Error fetching guest posts:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const guestPost = await GuestPost.create(data);
    return NextResponse.json(guestPost, { status: 201 });
  } catch (error: any) {
    console.error("Error creating guest post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
