// app/api/admin/guest-posts/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { GuestPost } from "@/models/GuestPost";
import { Blog } from "@/models/Blog";

interface Params {
  params: {
    id: string;
  };
}

// GET single guest post
export async function GET(req: Request, { params }: Params) {
  try {
    await connectDB();
    const guestPost = await GuestPost.findById(params.id);

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
export async function PUT(req: Request, { params }: Params) {
  try {
    await connectDB();
    const data = await req.json();

    const guestPost = await GuestPost.findByIdAndUpdate(params.id, data, {
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
export async function DELETE(req: Request, { params }: Params) {
  try {
    await connectDB();

    const guestPost = await GuestPost.findByIdAndDelete(params.id);

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
