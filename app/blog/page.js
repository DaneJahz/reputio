import Link from "next/link";
import { posts } from "./posts";

export const metadata = {
  title: "Blog — OwnerReply",
  description: "Tips and insights for small business owners on managing Google reviews and building a stronger online reputation.",
};

export default function Blog() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <Link href="/" className="text-xl font-bold text-gray-900">OwnerReply</Link>
        <div className="flex gap-4 items-center">
          <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900">Log in</Link>
          <Link href="/sign-up" className="text-sm bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">Start free trial</Link>
        </div>
      </nav>
      <main className="flex-1 max-w-3xl mx-auto px-4 md:px-8 py-16 md:py-24 w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">The OwnerReply Blog</h1>
        <p className="text-gray-500 mb-12">Tips and insights for small business owners on Google reviews, online reputation, and local SEO.</p>
        <div className="space-y-6">
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block border border-gray-100 rounded-2xl p-6 hover:border-gray-300 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-gray-400">{post.date}</span>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-400">{post.readTime}</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2 leading-snug">{post.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{post.description}</p>
              <p className="text-sm text-gray-900 font-medium mt-4">Read more →</p>
            </Link>
          ))}
        </div>
      </main>
      <footer className="border-t border-gray-100 px-8 py-6 text-center">
        <div className="flex justify-center gap-6 text-sm text-gray-400">
          <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link>
          <a href="mailto:getownerreply@gmail.com" className="hover:text-gray-600">Contact</a>
        </div>
        <p className="text-xs text-gray-300 mt-3">© 2026 OwnerReply. All rights reserved.</p>
      </footer>
    </div>
  );
}