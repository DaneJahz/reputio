"use client";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";

export default function Dashboard() {
  const [reviewText, setReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("/api/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          review: { reviewer_name: reviewerName, rating, review_text: reviewText }
        }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      setResponse("Error generating response. Please try again.");
    }
    setLoading(false);
  }

  async function handleSubscribe() {
    setSubscribing(true);
    try {
      const res = await fetch("/api/create-checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert("Error starting checkout. Please try again.");
    }
    setSubscribing(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-gray-900">Reputio</span>
        <div className="flex items-center gap-4">
          <button onClick={handleSubscribe} disabled={subscribing} className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 disabled:opacity-50">
            {subscribing ? "Loading..." : "Subscribe — $59/mo"}
          </button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>
      <main className="max-w-2xl mx-auto px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Test AI Response</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="mb-4">
            <label className="text-sm text-gray-500 block mb-1">Reviewer name</label>
            <input value={reviewerName} onChange={e => setReviewerName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="John Smith" />
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-500 block mb-1">Rating</label>
            <select value={rating} onChange={e => setRating(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value={5}>5 stars</option>
              <option value={4}>4 stars</option>
              <option value={3}>3 stars</option>
              <option value={2}>2 stars</option>
              <option value={1}>1 star</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-500 block mb-1">Review text</label>
            <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm h-24" placeholder="Paste a Google review here..." />
          </div>
          <button onClick={handleGenerate} disabled={loading || !reviewText} className="w-full bg-black text-white py-2 rounded-full text-sm hover:bg-gray-800 disabled:opacity-50">
            {loading ? "Generating..." : "Generate AI Response"}
          </button>
        </div>
        {response && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-sm text-gray-500 mb-2">AI generated response:</p>
            <p className="text-gray-900 text-sm leading-relaxed">{response}</p>
          </div>
        )}
      </main>
    </div>
  );
}