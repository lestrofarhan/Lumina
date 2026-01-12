// components/home/FeaturedStories.tsx
import { Blog } from "@/models/Blog";
import { Category } from "@/models/Category";
import { connectDB } from "@/lib/db";
import BlogCard from "@/components/common/BlogCard";

export default async function FeaturedStories() {
  await connectDB();

  const blogs = await Blog.find({ status: "published" })
    .limit(3)
    .sort({ createdAt: -1 })
    .lean();

  const blogsWithCategory = await Promise.all(
    blogs.map(async (blog) => {
      const categoryId = blog.category || blog.categoryId;

      let categoryName = "General";

      if (categoryId) {
        const category = await Category.findById(categoryId).lean();
        if (category?.name) categoryName = category.name;
      }

      return {
        ...blog,

        // 🔥 CRITICAL FIXES
        _id: blog._id.toString(),
        categoryId: blog.categoryId?.toString?.(),
        category: blog.category?.toString?.(),
        createdAt: blog.createdAt.toISOString(),
        updatedAt: blog.updatedAt?.toISOString?.(),

        categoryName,
      };
    })
  );

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogsWithCategory.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
}
