"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { user } = useUser();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState({});
  const [posting, setPosting] = useState({});
  const [ratingFilter, setRatingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (user) {
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
      if (data.business?.google_access_token) {
        fetchReviews();
      }
    } catch (err) {
      console.error("Setup error:", err);
    }
  }

  async function fetchReviews() {
    setReviewsLoading(true);
    try {
      const res = await fetch("/api/google/reviews");
      const data = await res.json();
      if (data.reviews) setReviews(data.reviews);
    } catch (err) {
      console.error("Reviews error:", err);
    }
    setReviewsLoading(false);
  }

  async function handleGenerate(review) {
    setLoading(prev => ({ ...prev, [review.reviewId]: true }));
    try {
      const res = await fetch("/api/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          review: {
            reviewer_name: review.reviewer?.displayName || "Customer",
            rating: ["ONE","TWO","THREE","FOUR","FIVE"].indexOf(review.starRating) + 1,
            review_text: review.comment || "No comment left",
          },
          tone: business?.tone || "professional",
        }),
      });
      const data = await res.json();
      setResponses(prev => ({ ...prev, [review.reviewId]: data.response }));
    } catch (err) {
      console.error("Generate error:", err);
    }
    setLoading(prev => ({ ...prev, [review.reviewId]: false }));
  }

  async function handlePost(review) {
    setPosting(prev => ({ ...prev, [review.reviewId]: true }));
    try {
      const res = await fetch("/api/google/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewName: review.name,
          replyText: responses[review.reviewId],
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Response posted to Google!");
        setResponses(prev => ({ ...prev, [review.reviewId]: "" }));
      }
    } catch (err) {
      console.error("Post error:", err);
    }
    setPosting(prev => ({ ...prev, [review.reviewId]: false }));
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

  async function handleManageSubscription() {
    try {
      const res = await fetch("/api/customer-portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert("Error opening billing portal. Please try again.");
    }
  }

  const trialDaysLeft = business?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(business.trial_ends_at) - new Date()) / (1000 * 60 * 60 * 24)))
    : 14;

  const isTrialing = business?.subscription_status === "trial";
  const isActive = business?.subscription_status === "active";
  const googleConnected = !!business?.google_access_token;
  const starRatingMap = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
  const totalReviews = reviews.length;
  const answeredReviews = reviews.filter(r => r.reviewReply).length;
  const responseRate = totalReviews > 0 ? Math.round((answeredReviews / totalReviews) * 100) : 0;
  const avgRating = totalReviews > 0
   ? (reviews.reduce((sum, r) => sum + (starRatingMap[r.starRating] || 0), 0) / totalReviews).toFixed(1)
   : "—";
  const ratingBreakdown = [5, 4, 3, 2, 1].map(star => ({
   star,
   count: reviews.filter(r => starRatingMap[r.starRating] === star).length,
   percent: totalReviews > 0
     ? Math.round((reviews.filter(r => starRatingMap[r.starRating] === star).length / totalReviews) * 100)
     : 0,
}));
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-xl font-bold text-gray-900">OwnerReply</span>
          <a href="/history" className="hidden md:block text-sm text-gray-500 hover:text-gray-900">History</a>
          <a href="/settings" className="hidden md:block text-sm text-gray-500 hover:text-gray-900">Settings</a>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {isTrialing && (
            <span className="hidden md:block text-sm text-amber-600 font-medium">{trialDaysLeft} days left in trial</span>
          )}
          {isTrialing && (
            <span className="block md:hidden text-xs text-amber-600 font-medium">{trialDaysLeft}d left</span>
          )}
          {isActive ? (
            <button onClick={handleManageSubscription} className="border border-gray-200 text-gray-700 px-3 py-2 rounded-full text-xs md:text-sm hover:bg-gray-50">
              Manage
            </button>
          ) : (
            <button onClick={handleSubscribe} disabled={subscribing} className="bg-black text-white px-3 py-2 rounded-full text-xs md:text-sm hover:bg-gray-800 disabled:opacity-50">
              {subscribing ? "..." : "Subscribe $59/mo"}
            </button>
          )}
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {!googleConnected && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 md:p-6 mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-blue-900 text-sm">Connect your Google Business Profile</p>
              <p className="text-blue-700 text-xs md:text-sm mt-1">Required to pull in and respond to reviews.</p>
            </div>
            <a href="/api/google/connect" className="bg-black text-white px-3 md:px-4 py-2 rounded-full text-xs md:text-sm hover:bg-gray-800 whitespace-nowrap">Connect Google</a>
          </div>
        )}
        {googleConnected && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <p className="text-green-800 text-sm font-medium">Google Business Profile connected</p>
            <button onClick={fetchReviews} className="text-sm text-green-700 hover:text-green-900 underline">Refresh</button>
          </div>
        )}
        {!googleConnected || !business?.business_name ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-1">Get started with OwnerReply</h2>
            <p className="text-sm text-gray-500 mb-4">Complete these steps to start responding to reviews.</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm text-gray-400 line-through">Create your account</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${business?.business_name ? "bg-green-500" : "border-2 border-gray-200"}`}>
                  {business?.business_name && <span className="text-white text-xs">✓</span>}
                </div>
                <span className={`text-sm ${business?.business_name ? "text-gray-400 line-through" : "text-gray-900"}`}>
                  Enter your business name
                </span>
                {!business?.business_name && (
                  <a href="/settings" className="text-xs text-blue-600 hover:underline ml-auto">Go to Settings →</a>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${googleConnected ? "bg-green-500" : "border-2 border-gray-200"}`}>
                  {googleConnected && <span className="text-white text-xs">✓</span>}
                </div>
                <span className={`text-sm ${googleConnected ? "text-gray-400 line-through" : "text-gray-900"}`}>
                  Connect your Google Business Profile
                </span>
                {!googleConnected && (
                  <a href="/api/google/connect" className="text-xs text-blue-600 hover:underline ml-auto">Connect →</a>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isActive ? "bg-green-500" : "border-2 border-gray-200"}`}>
                  {isActive && <span className="text-white text-xs">✓</span>}
                </div>
                <span className={`text-sm ${isActive ? "text-gray-400 line-through" : "text-gray-900"}`}>
                  Subscribe to get full access
                </span>
                {!isActive && (
                  <button onClick={handleSubscribe} className="text-xs text-blue-600 hover:underline ml-auto">Subscribe →</button>
                )}
              </div>
            </div>
          </div>
        ) : null}
        {isTrialing && trialDaysLeft <= 3 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
            <p className="text-amber-800 text-sm font-medium">Your trial ends in {trialDaysLeft} days. Subscribe to keep access.</p>
          </div>
        )}
        <div className="flex items-center justify-between mb-2">
  <h1 className="text-2xl font-bold text-gray-900">Your Reviews</h1>
</div>
<p className="text-gray-500 text-sm mb-4">Generate and post AI responses to your Google reviews.</p>

<div className="flex flex-wrap gap-2 mb-8">
  <div className="flex gap-1 flex-wrap">
    {["all", "1", "2", "3", "4", "5"].map(r => (
      <button
        key={r}
        onClick={() => setRatingFilter(r)}
        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
          ratingFilter === r
            ? "bg-black text-white border-black"
            : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
        }`}
      >
        {r === "all" ? "All stars" : "★".repeat(Number(r))}
      </button>
    ))}
  </div>
  <div className="flex gap-1">
    {["all", "unanswered"].map(s => (
      <button
        key={s}
        onClick={() => setStatusFilter(s)}
        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
          statusFilter === s
            ? "bg-black text-white border-black"
            : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
        }`}
      >
        {s === "all" ? "All reviews" : "Unanswered"}
      </button>
    ))}
  </div>
</div>

{reviewsLoading && (
  <div className="text-center py-12 text-gray-400 text-sm">Loading reviews...</div>
)}
{!reviewsLoading && reviews.length === 0 && googleConnected && (
  <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
    <p className="text-gray-400 text-sm">No reviews found. If you have reviews on Google they should appear here.</p>
  </div>
)}
{!reviewsLoading && !googleConnected && (
  <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
    <p className="text-gray-400 text-sm">Connect your Google Business Profile above to see your reviews.</p>
  </div>
)}
{reviews
  .filter(review => {
    const rating = ["ONE","TWO","THREE","FOUR","FIVE"].indexOf(review.starRating) + 1;
    if (ratingFilter !== "all" && rating !== Number(ratingFilter)) return false;
    if (statusFilter === "unanswered" && review.reviewReply) return false;
    return true;
  })
  .map(review => (
    <div key={review.reviewId} className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-medium text-gray-900 text-sm">{review.reviewer?.displayName || "Anonymous"}</p>
          <p className="text-amber-500 text-sm">{"★".repeat(starRatingMap[review.starRating] || 0)}{"☆".repeat(5 - (starRatingMap[review.starRating] || 0))}</p>
        </div>
        <p className="text-xs text-gray-400">{new Date(review.createTime).toLocaleDateString()}</p>
      </div>
      <p className="text-gray-600 text-sm mb-4">{review.comment || "No comment left."}</p>
      {review.reviewReply && (
        <div className="bg-gray-50 rounded-xl p-3 mb-4">
          <p className="text-xs text-gray-400 mb-1">Your response:</p>
          <p className="text-gray-600 text-sm">{review.reviewReply.comment}</p>
        </div>
      )}
      {!review.reviewReply && (
        <>
          {responses[review.reviewId] && (
            <div className="bg-blue-50 rounded-xl p-3 mb-3">
              <p className="text-xs text-gray-400 mb-1">AI draft:</p>
              <textarea
                value={responses[review.reviewId]}
                onChange={e => setResponses(prev => ({ ...prev, [review.reviewId]: e.target.value }))}
                className="w-full bg-transparent text-gray-700 text-sm resize-none outline-none"
                rows={3}
              />
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => handleGenerate(review)} disabled={loading[review.reviewId]} className="bg-black text-white px-4 py-2 rounded-full text-xs hover:bg-gray-800 disabled:opacity-50">
              {loading[review.reviewId] ? "Generating..." : "Generate AI Response"}
            </button>
            {responses[review.reviewId] && (
              <button onClick={() => handlePost(review)} disabled={posting[review.reviewId]} className="border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-xs hover:bg-gray-50 disabled:opacity-50">
                {posting[review.reviewId] ? "Posting..." : "Post to Google"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  ))}
      </main>
    </div>
  );
}