import Link from "next/link";
import sql from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const posts = await sql`
    SELECT * FROM blog_posts 
    WHERE slug = ${slug} 
    AND published = true
  `;
  
  if (!posts.length) notFound();
  const post = posts[0];

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <Link href="/" className="text-xl font-bold text-gray-900">OwnerReply</Link>
        <div className="flex gap-4 items-center">
          <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900">← Blog</Link>
          <Link href="/sign-up" className="text-sm bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">Start free trial</Link>
        </div>
      </nav>
      <main className="flex-1 max-w-2xl mx-auto px-4 md:px-8 py-16 w-full">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-gray-400">By {post.author}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">{post.title}</h1>
        <div className="prose prose-gray max-w-none">
  {post.content.trim().split(/\n\n|\r\n\r\n/).filter(p => p.trim()).map((paragraph, i) => {
    const trimmed = paragraph.trim();
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      return <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3">{trimmed.replace(/\*\*/g, "")}</h2>;
    }
    if (trimmed.includes("**")) {
      return <p key={i} className="text-gray-600 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: trimmed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />;
    }
    return <p key={i} className="text-gray-600 leading-relaxed mb-4">{trimmed}</p>;
  })}
</div>
        <div className="mt-12 bg-gray-50 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Try OwnerReply free for 14 days</h3>
          <p className="text-sm text-gray-500 mb-4">AI-powered Google review responses. One click to approve and post. No credit card required.</p>
          <Link href="/sign-up" className="inline-block bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800">Start free trial →</Link>
        </div>
      </main>
      <footer className="border-t border-gray-100 px-8 py-6 text-center mt-12">
        <div className="flex justify-center gap-6 text-sm text-gray-400 flex-wrap">
          <Link href="/blog" className="hover:text-gray-600">Blog</Link>
          <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link>
          <a href="mailto:getownerreply@gmail.com" className="hover:text-gray-600">Contact</a>
        </div>
        <p className="text-xs text-gray-300 mt-3">© 2026 OwnerReply. All rights reserved.</p>
      </footer>
    </div>
  );
}