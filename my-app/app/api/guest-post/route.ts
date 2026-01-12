import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";
import { GuestPost } from "@/models/GuestPost";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to create URL-friendly slugs
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/(^-|-$)/g, ""); // Remove leading/trailing hyphens
};


export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    const file = formData.get("image") as File;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const website = formData.get("website") as string;
    const articleTitle = formData.get("articleTitle") as string;
    const articleContent = formData.get("articleContent") as string;
    const category = formData.get("category") as string;
    const backlink = formData.get("backlink") as string;
    const anchorText = formData.get("anchorText") as string;

    // Generate Slug from Title
    let slug = generateSlug(articleTitle);

    // Check for slug collision (ensure uniqueness)
    const existingPost = await GuestPost.findOne({ slug });
    const existingingblog = await Blog.findOne({ slug });

    if (existingPost || existingingblog) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }
    
    let imageUrl = "";
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResponse: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "guest_posts" }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
          })
          .end(buffer);
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newGuestPost = await GuestPost.create({
      name,
      email,
      website,
      articleTitle,
      slug, // Saving the slug
      articleContent,
      category,
      image: imageUrl,
      backlink,
      anchorText,
      status: "pending",
    });
    
    return NextResponse.json(newGuestPost, { status: 201 });
  } catch (error: any) {
    console.error("Submission Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
