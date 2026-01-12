import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
      {/* 1. Background Glow 
          The '-z-10' and 'blur-3xl' create that soft indigo aura at the top.
      */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge with Fade-in Animation */}
        <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold tracking-wide uppercase mb-6 animate-fade-in">
          The Future of Publishing
        </span>

        {/* Headline with Slide-up Animation */}
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6 animate-slide-up">
          Publish, Discover & Grow <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            with Quality Content
          </span>
        </h1>

        {/* Description with delayed Slide-up */}
        <p
          className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto mb-10 animate-slide-up"
          style={{ animationDelay: "0.1s", animationFillMode: "both" }}
        >
          Join a community of writers and readers. Share your expertise, grow
          your audience, and discover insightful articles.
        </p>

        {/* Buttons with Hover lifting effects and shadow glows */}
        <div
          className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          <Link
            href="/blogs"
            className="px-8 py-3.5 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1 active:scale-95"
          >
            Explore Blogs
          </Link>
          <Link
            href="/write-for-us"
            className="px-8 py-3.5 rounded-full bg-white text-slate-700 border border-slate-200 font-medium hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-1 active:scale-95"
          >
            Write for Us
          </Link>
        </div>
      </div>
    </section>
  );
}
