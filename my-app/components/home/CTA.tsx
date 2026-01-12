import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* The Cube Pattern Layer */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/cubes.png')",
        }}
      ></div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Share Your Knowledge with the World
        </h2>
        <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
          Join our network of expert contributors. Guest posting helps you build
          authority, reach new audiences, and improve your SEO.
        </p>
        <Link
          href="/write-for-us"
          className="px-8 py-4 bg-primary-600 hover:bg-primary-500  bg-indigo-600 text hover:bg-indigo-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-primary-500/50! transform hover:-translate-y-1 inline-block"
        >
          Submit a Guest Post
        </Link>
      </div>
    </section>
  );
}
