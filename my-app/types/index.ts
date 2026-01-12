// types/index.ts
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage?: string;
  categoryId: string;
  authorId?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  views?: any;
}

export interface GuestPost {
  _id: string;
  name: string;
  email: string;
  website?: string;
  articleTitle: string;
  slug: string;
  articleContent: string;
  category?: string;
  image?: string;
  backlink?: string;
  anchorText?: string;
  status: "pending" | "approved" | "rejected" | "published";
  authorType: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// types/index.ts
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage?: string;
  categoryId: string;
  authorId?: string;
  author?: User; // Add author object
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "editor" | "writer";
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

// types/index.ts - Add or update GuestPost interface
export interface GuestPost {
  _id: string;
  name: string;
  email: string;
  website?: string;
  articleTitle: string;
  slug: string;
  articleContent: string;
  category?: string;
  image?: string;
  backlink?: string;
  anchorText?: string;
  status: "pending" | "approved" | "rejected" | "published";
  authorType: string;
  createdAt: string;
  updatedAt: string;
}

// types/index.ts - Add/update User interface
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "editor" | "writer";
  bio?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  seoTitle: string;
  seoDescription: string;
  analyticsId?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

// types/next-auth.d.ts
import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    id: string;
  }
  
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    id: string;
  }
}