"use client";
import { useState } from "react";
import Link from "next/link";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, businessName }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <Link href="/" className="text-xl font-bold text-gray-900">OwnerReply</Link>
        <div className="flex gap-4 items-center">
          <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 hidden md:block">Blog</Link>
          <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900">Log in</Link>
        </div>
      </nav>
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          {!submitted ? (
            <>
              <div className="inline-block bg-amber-50 text-amber-700 text-sm font-medium px-4 py-1 rounded-full mb-6">
                🚀 Launching soon
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">OwnerReply is almost ready</h1>
              <p className="text-gray-500 mb-8 leading-relaxed">AI-powered Google review responses for small businesses. Join the waitlist and be the first to know when we launch — plus get a special early access offer.</p>
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
                <p className="text-sm font-medium text-gray-900 mb-3">What you'll get with OwnerReply:</p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">✓ AI drafts personalized responses to every Google review</p>
                  <p className="text-sm text-gray-600">✓ One click to approve and post directly to Google</p>
                  <p className="text-sm text-gray-600">✓ 30 seconds per review — every review, every time</p>
                  <p className="text-sm text-gray-600">✓ Weekly review digest and instant alerts</p>
                  <p className="text-sm text-gray-600">✓ $35/mo per location — 14-day free trial included</p>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  placeholder="Your business name (optional)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading ? "Joining..." : "Join the waitlist →"}
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-4">No spam. Just a heads up when we launch.</p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-6">🎉</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">You're on the list!</h1>
              <p className="text-gray-500 mb-8">We'll email you the moment OwnerReply launches. You'll get early access and a special offer just for waiting.</p>
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
                <p className="text-sm font-medium text-gray-900 mb-3">While you wait, check out our blog:</p>
                <div className="space-y-2">
                  <a href="/blog/how-to-respond-to-negative-google-review" className="block text-sm text-blue-600 hover:underline">How to Respond to a Negative Google Review</a>
                  <a href="/blog/google-reviews-local-search-ranking-2026" className="block text-sm text-blue-600 hover:underline">How Google Reviews Affect Your Local Search Ranking</a>
                  <a href="/blog/cost-of-ignoring-google-reviews" className="block text-sm text-blue-600 hover:underline">What Happens When You Ignore Google Reviews</a>
                </div>
              </div>
              <Link href="/blog" className="inline-block border border-gray-200 text-gray-700 px-6 py-2 rounded-full text-sm hover:bg-gray-50">
                Read all articles →
              </Link>
            </>
          )}
        </div>
      </main>
      <footer className="border-t border-gray-100 px-8 py-6 text-center">
        <div className="flex justify-center gap-6 text-sm text-gray-400 flex-wrap">
          <Link href="/blog" className="hover:text-gray-600">Blog</Link>
          <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link>
          <a href="mailto:getownerreply@gmail.com" className="hover:text-gray-600">Contact</a>
          <a href="https://www.facebook.com/profile.php?id=61589344806313" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">Facebook</a>
          <a href="https://x.com/GetOwnerReply" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">X</a>
          <a href="https://www.instagram.com/ownerreply/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">Instagram</a>
        </div>
        <p className="text-xs text-gray-300 mt-3">© 2026 OwnerReply. All rights reserved.</p>
      </footer>
    </div>
  );
}