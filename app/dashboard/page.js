"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { user } = useUser();
  const [reviewText, setReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [business, setBusiness] = useState(null);
  const [setupDone, setSetupDone] = useState(false);

  useEffect(() => {
    if (user && !setupDone) {
      registerBusiness();
    }
  }, [user]);

  async function registerBusiness() {
    try {
      const res = await fetch("/api/register-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.fullName || user.primaryEmailAddress?.emailAddress,
          email: user.primaryEmailAddress?.emailAddress,
        }),
      });
      const data = await res.json();
      setBusiness(data.business);
      setSetupDone(true);
    } catch (err) {
      console.error("Setup error:", err);
    }
  }

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

  const trialDaysLeft = business?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(business.trial_ends_at) - new Date()) / (1000 * 60 * 60 * 24)))
    : 14;

  const isTrialing = business?.subscription_status === "trial";
  const googleConnected = !!business?.google_access_token;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-gray-900">Reputio</span>
        <div className="flex items-center gap-4">
          {isTrialing && (
            <span className="text-sm text-amber-600 font-medium">{trialDaysLeft} days left in trial</span>
          )}
          <button onClick={handleSubscribe} disabled={subscribing} className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 disabled:opacity-50">
            {subscribing ? "Loading..." : "Subscribe $59/mo"}
          </button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>
      <main className="max-w-2xl mx-auto px-8 py-12">
        {!googleConnected && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900 text-sm">Connect your Google Business Profile</p>
              <p className="text-blue-700 text-sm mt-1">Required to automatically pull in and respond to reviews.</p>
            </div>
            <a href="/api/google/connect" className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 whitespace-nowrap">
              Connect Google
            </a>
          </div>
        )}
        {googleConnected && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
            <p className="text-green-800 text-sm font-medium">Google Business Profile connected</p>
          </div>
        )}
        {isTrialing && trialDaysLeft <= 3 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
            <p className="text-amber-800 text-sm font-medium">Your trial ends in {trialDaysLeft} days. Subscribe to keep access.</p>
          </div>
        )}
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