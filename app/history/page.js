"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (data.history) setHistory(data.history);
    } catch (err) {
      console.error("History error:", err);
    }
    setLoading(false);
  }

  const stars = (rating) => "★".repeat(rating) + "☆".repeat(5 - rating);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-gray-900">OwnerReply</span>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">
          Back to dashboard
        </Link>
      </nav>
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Response History</h1>
        <p className="text-gray-500 text-sm mb-8">All responses you've posted to Google.</p>

        {loading && (
          <div className="text-center py-12 text-gray-400 text-sm">Loading history...</div>
        )}

        {!loading && history.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-gray-400 text-sm">No responses posted yet.</p>
            <Link href="/dashboard" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
              Go respond to some reviews →
            </Link>
          </div>
        )}

        {history.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-gray-900 text-sm">{item.reviewer_name || "Anonymous"}</p>
                <p className="text-amber-500 text-sm">{stars(item.rating || 0)}</p>
              </div>
              <p className="text-xs text-gray-400">
                {item.review_date ? new Date(item.review_date).toLocaleDateString() : ""}
              </p>
            </div>
            <p className="text-gray-600 text-sm mb-4">{item.review_text || "No comment left."}</p>
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">
                Your response · Posted {item.posted_at ? new Date(item.posted_at).toLocaleDateString() : ""}
              </p>
              <p className="text-gray-700 text-sm">{item.draft_text}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}