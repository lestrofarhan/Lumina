import { NextResponse } from "next/server";
import { Category } from "@/models/Category";
import { connectDB } from "@/lib/db";

export async function GET() {
    await connectDB();
    
  const categories = await Category.find({}).sort({ name: 1 });
  return NextResponse.json(categories);
}
