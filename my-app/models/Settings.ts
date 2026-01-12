import { model, models, Schema } from "mongoose";

const settingsSchema = new Schema(
  {
    siteName: { type: String, required: true, default: "My Blog" },
    siteDescription: {
      type: String,
      required: true,
      default: "A modern blog platform",
    },
    siteUrl: { type: String, required: true, default: "http://localhost:3000" },
    contactEmail: {
      type: String,
      required: true,
      default: "admin@example.com",
    },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    analyticsId: { type: String, default: "" },
    socialLinks: {
      twitter: { type: String, default: "" },
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export const Settings = models.Settings || model("Settings", settingsSchema);
