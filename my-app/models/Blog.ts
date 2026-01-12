import { model, models, Schema } from "mongoose";


// models/Blog.ts - Update schema
const blogSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  featuredImage: { type: String },
  categoryId: { type: String }, 
  authorId: { type: Schema.Types.ObjectId, ref: "User" }, // Reference User model
  metaTitle: { type: String },
  metaDescription: { type: String },
  tags: [String],
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  views: { type: Number, default: 0 }, // Add views count
},
{ timestamps: true });

export const Blog = models.Blog || model("Blog" , blogSchema)
