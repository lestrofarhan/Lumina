import { model, models, Schema } from "mongoose";

const guestPostSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String },
    articleTitle: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    articleContent: { type: String, required: true },
    category: { type: String },
    image: { type: String },
    backlink: { type: String },
    anchorText: { type: String },
    views: { type: Number, default: 0 }, // Add views count
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "published"],
      default: "pending",
    },
    authorType: { type: String, default: "guest" },
  },
  { timestamps: true }
);

export const GuestPost =
  models.GuestPost || model("GuestPost", guestPostSchema);
