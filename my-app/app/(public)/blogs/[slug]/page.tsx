import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";
import { GuestPost } from "@/models/GuestPost";
import { Category } from "@/models/Category";
import {
  Calendar,
  User,
  Eye,
  CheckCircle,
  ShieldCheck,
  Clock,
  ChevronLeft,
  Share2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import BlogCard from "@/components/common/BlogCard"; // Reusing your card component

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const post =
    (await Blog.findOne({ slug })) || (await GuestPost.findOne({ slug }));
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title || post.articleTitle} | Lumina`,
    description: post.metaDescription || "Read our professional deep dive.",
  };
}

export default async function CombinedBlogDetailPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();

  // 1. Fetch Main Post & Increment Views
  let rawPost = await Blog.findOneAndUpdate(
    { slug, status: "published" },
    { $inc: { views: 1 } },
    { new: true }
  );

  let isGuest = false;
  if (!rawPost) {
    rawPost = await GuestPost.findOneAndUpdate(
      { slug, status: "published" },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (rawPost) isGuest = true;
  }

  if (!rawPost) notFound();

  // 2. Fetch Category Name
  const categoryId = isGuest ? rawPost.category : rawPost.categoryId;
  const categoryDoc = await Category.findById(categoryId);
  const categoryName = categoryDoc?.name || "General";

  // 3. Fetch Related Posts (Limit 3)
  const relatedBlogs = await Blog.find({
    categoryId: rawPost.categoryId,
    slug: { $ne: slug },
    status: "published",
  })
    .limit(3)
    .lean();

  const content = isGuest ? rawPost.articleContent : rawPost.content;
  const wordCount = content.split(/\s+/g).length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <article className="min-h-screen bg-white selection:bg-indigo-100 pb-20">
      {/* Floating Action Bar (Mobile/Desktop) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 border border-white/10 backdrop-blur-md">
        <Link
          href="/blogs"
          className="text-sm font-bold flex items-center gap-2 hover:text-indigo-400"
        >
          <ChevronLeft size={16} /> Feed
        </Link>
       
      </div>

      <header
        className={`pt-24 pb-32 md:pt-32 md:pb-48 ${
          isGuest ? "bg-slate-50 text-slate-900" : "bg-slate-900 text-white"
        }`}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            {!isGuest ? (
              <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em]">
                <ShieldCheck size={14} /> Official Editorial
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-200 text-orange-700 text-[10px] font-black uppercase tracking-[0.2em]">
                <User size={14} /> Guest Contributor
              </span>
            )}
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              {categoryName}
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black leading-[1.1] mb-10 tracking-tight">
            {isGuest ? rawPost.articleTitle : rawPost.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 text-sm font-medium">
            <div
              className={`flex items-center gap-3 p-1.5 pr-5 rounded-full border shadow-sm ${
                !isGuest
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-slate-200"
              }`}
            >
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm ${
                  !isGuest
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-white"
                }`}
              >
                {(isGuest ? rawPost.name : "Lumina Admin").charAt(0)}
              </div>
              <span>{isGuest ? rawPost.name : "Lumina Admin"}</span>
              {!isGuest && (
                <CheckCircle size={16} className="text-indigo-400" />
              )}
            </div>

            <div className="flex items-center gap-6 text-slate-400">
              <span className="flex items-center gap-2">
                <Calendar size={18} />{" "}
                {new Date(rawPost.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={18} /> {readTime} min read
              </span>
              <span className="flex items-center gap-2">
                <Eye size={18} /> {rawPost.views?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="max-w-6xl mx-auto px-6 -mt-24 md:-mt-32 mb-20 relative z-20">
        <div className="relative aspect-[16/8] md:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border-[8px] md:border-[16px] border-white bg-slate-200">
          <Image
            src={
              (isGuest ? rawPost.image : rawPost.featuredImage) ||
              "/placeholder.jpg"
            }
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <div
          className="blog-content prose prose-lg md:prose-xl prose-slate max-w-none px-6 prose-headings:font-black prose-headings:tracking-tight prose-a:text-indigo-600 prose-img:rounded-3xl"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Newsletter Section */}
        <div className="mt-20 mx-6 p-8 md:p-12 rounded-[2.5rem] bg-indigo-600 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-4">Enjoyed this article?</h3>
            <p className="text-indigo-100 mb-8 max-w-md mx-auto font-medium">
              Join 5,000+ readers and get our latest insights delivered straight
              to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-indigo-200 outline-none focus:bg-white/20 transition-all"
              />
              <button className="px-8 py-4 rounded-2xl bg-white text-indigo-600 font-bold hover:bg-indigo-50 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        </div>
      </div>

      {/* Related Posts Section */}
      {relatedBlogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-32">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                More from {categoryName}
              </h2>
              <p className="text-slate-500 font-medium mt-2">
                Specially curated for you based on this topic.
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden md:flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all"
            >
              View All <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedBlogs.map((blog: any) => (
              <BlogCard
                key={blog._id.toString()}
                blog={{ ...blog, _id: blog._id.toString(), categoryName }}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
