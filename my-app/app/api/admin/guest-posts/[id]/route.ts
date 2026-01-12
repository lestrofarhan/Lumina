import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { GuestPost } from "@/models/GuestPost";
import { Blog } from "@/models/Blog";

// Next.js 16 requirement: params must be a Promise
interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// GET single guest post
export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    // Await the params before using the id
    const { id } = await params;
    const guestPost = await GuestPost.findById(id);

    if (!guestPost) {
      return NextResponse.json(
        { error: "Guest post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(guestPost);
  } catch (error: any) {
    console.error("Error fetching guest post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update guest post (for approve/reject)
export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    // Await the params before using the id
    const { id } = await params;
    const data = await req.json();

    const guestPost = await GuestPost.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!guestPost) {
      return NextResponse.json(
        { error: "Guest post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(guestPost);
  } catch (error: any) {
    console.error("Error updating guest post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE guest post
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    // Await the params before using the id
    const { id } = await params;
    const guestPost = await GuestPost.findByIdAndDelete(id);

    if (!guestPost) {
      return NextResponse.json(
        { error: "Guest post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Guest post deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting guest post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
