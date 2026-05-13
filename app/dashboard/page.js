"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { user } = useUser();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [showPlanPicker, setShowPlanPicker] = useState(false);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState({});
  const [posting, setPosting] = useState({});
  const [ratingFilter, setRatingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCancelFlow, setShowCancelFlow] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelStep, setCancelStep] = useState(1);
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [referralCopied, setReferralCopied] = useState(false);

  useEffect(() => {
    if (user) {
      registerBusiness();
    }
  }, [user]);

  async function registerBusiness() {
    try {
      await fetch("/api/register-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.fullName || user.primaryEmailAddress?.emailAddress,
          email: user.primaryEmailAddress?.emailAddress,
        }),
      });
    } catch (err) {
      console.error("Register error (non-fatal):", err);
    }

    try {
      const settingsRes = await fetch("/api/settings");
      const settingsData = await settingsRes.json();
      if (settingsData.business) {
        setBusiness(settingsData.business);
        if (settingsData.business.google_access_token) {
          fetchReviews();
        }
      }
    } catch (err) {
      console.error("Settings fetch error:", err);
    }

    // Fetch referral code
    try {
      const referralRes = await fetch("/api/referral");
      const referralData = await referralRes.json();
      if (referralData.referralCode) {
        setReferralCode(referralData.referralCode);
        setReferralCount(referralData.referralCount);
      }
    } catch (err) {
      console.error("Referral fetch error:", err);
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
      if (data.error === "subscription_required") {
        alert("Your trial has expired. Please subscribe to continue generating responses.");
        return;
      }
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

  async function handleSaveTemplate(reviewId) {
    const content = responses[reviewId];
    if (!content) return;
    const name = prompt("Name this template (e.g. '5-star thank you', 'Food complaint response'):");
    if (!name) return;
    try {
      await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, content }),
      });
      alert("Template saved! View all templates at /templates");
    } catch (err) {
      console.error("Save template error:", err);
    }
  }

  async function handleManageSubscription() {
    setShowCancelFlow(true);
  }

  async function handleCancelFlowSubmit(acceptDiscount) {
    setApplyingDiscount(true);
    try {
      const res = await fetch("/api/cancel-flow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason, acceptDiscount }),
      });
      const data = await res.json();

      if (data.discountApplied) {
        setShowCancelFlow(false);
        alert("Your discount has been applied! You'll be charged $25/mo for the next 2 months. Thank you for staying! 🎉");
        return;
      }

      setShowCancelFlow(false);
      const portalRes = await fetch("/api/customer-portal", { method: "POST" });
      const portalData = await portalRes.json();
      if (portalData.url) window.location.href = portalData.url;
    } catch (err) {
      console.error("Cancel flow error:", err);
    }
    setApplyingDiscount(false);
  }

  async function handleSubscribe(plan = "reviews") {
  setSubscribing(true);
  try {
    const res = await fetch("/api/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  } catch (err) {
    console.error("Checkout error:", err);
    alert("Error starting checkout. Please try again.");
  }
  setSubscribing(false);
}

  const trialDaysLeft = business?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(business.trial_ends_at) - new Date()) / (1000 * 60 * 60 * 24)))
    : 14;

  const isTrialing = business?.subscription_status === "trial";
  const isActive = business?.subscription_status === "active";
  const googleConnected = !!business?.google_access_token;
  const starRatingMap = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

  function getSentiment(starRating) {
    const rating = starRatingMap[starRating] || 0;
    if (rating >= 4) return { label: "Positive", color: "bg-green-100 text-green-700" };
    if (rating === 3) return { label: "Neutral", color: "bg-amber-100 text-amber-700" };
    return { label: "Negative", color: "bg-red-100 text-red-700" };
  }

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
          <a href="/templates" className="hidden md:block text-sm text-gray-500 hover:text-gray-900">Templates</a>
          <a href="/settings" className="hidden md:block text-sm text-gray-500 hover:text-gray-900">Settings</a>
          <a href="/tools/followup" className="hidden md:block text-sm text-gray-500 hover:text-gray-900">Second Knock</a>
          <a href="/blog" className="hidden md:block text-sm text-gray-500 hover:text-gray-900">Blog</a>
          <a href="/help" className="hidden md:block text-sm text-gray-500 hover:text-gray-900">Help</a>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {isTrialing && (
            <span className="hidden md:block text-sm text-amber-600 font-medium">{trialDaysLeft} days left in trial</span>
          )}
          {isTrialing && (
            <span className="block md:hidden text-xs text-amber-600 font-medium">{trialDaysLeft}d left</span>
          )}
          {isActive && business?.stripe_subscription_id ? (
            <button onClick={handleManageSubscription} className="border border-gray-200 text-gray-700 px-3 py-2 rounded-full text-xs md:text-sm hover:bg-gray-50">
              Manage
            </button>
          ) : !isActive ? (
            <button onClick={() => setShowPlanPicker(true)} disabled={subscribing} className="bg-black text-white px-3 py-2 rounded-full text-xs md:text-sm hover:bg-gray-800 disabled:opacity-50">
              {subscribing ? "..." : "Subscribe"}
            </button>
          ) : null}
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Tools Hub */}
<div className="grid grid-cols-2 gap-4 mb-8">
  <div className="bg-white border-2 border-black rounded-2xl p-5">
    <p className="text-lg font-bold text-gray-900 mb-1">📬 Review Replies</p>
    <p className="text-xs text-gray-500 mb-3">AI responses to your Google reviews. One-click post.</p>
    <p className="text-xs font-medium text-gray-900">You're here ↓</p>
  </div>
  <a href="/tools/followup" className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-400 transition-all block">
    <p className="text-lg font-bold text-gray-900 mb-1">🔨 Second Knock</p>
    <p className="text-xs text-gray-500 mb-3">Generate estimate follow-ups and win-back messages.</p>
    <p className="text-xs font-medium text-green-600">Available now →</p>
  </a>
</div>
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
        {!googleConnected || !business?.business_name || !isActive ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Welcome{user?.firstName ? `, ${user.firstName}` : ""}! Let's get you set up 👋
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">Complete these steps to start responding to reviews.</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">
                  {[true, !!business?.business_name, googleConnected, isActive].filter(Boolean).length} of 4 complete
                </p>
                <div className="flex gap-1 mt-1">
                  {[true, !!business?.business_name, googleConnected, isActive].map((done, i) => (
                    <div key={i} className={`h-1.5 w-8 rounded-full ${done ? "bg-green-500" : "bg-gray-200"}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <span className="text-sm text-gray-400 line-through">Create your account</span>
                  <p className="text-xs text-gray-400 mt-0.5">You're in — welcome to OwnerReply!</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${business?.business_name ? "bg-green-500" : "border-2 border-gray-200"}`}>
                  {business?.business_name && <span className="text-white text-xs">✓</span>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${business?.business_name ? "text-gray-400 line-through" : "text-gray-900 font-medium"}`}>
                      Enter your business name
                    </span>
                    {!business?.business_name && (
                      <a href="/settings" className="text-xs bg-black text-white px-3 py-1 rounded-full hover:bg-gray-800">Go to Settings →</a>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">So your AI responses are personalized to your brand.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${googleConnected ? "bg-green-500" : "border-2 border-gray-200"}`}>
                  {googleConnected && <span className="text-white text-xs">✓</span>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${googleConnected ? "text-gray-400 line-through" : "text-gray-900 font-medium"}`}>
                      Connect your Google Business Profile
                    </span>
                    {!googleConnected && (
                      <a href="/api/google/connect" className="text-xs bg-black text-white px-3 py-1 rounded-full hover:bg-gray-800">Connect →</a>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Takes 30 seconds. Required to pull in your reviews and post responses.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isActive ? "bg-green-500" : "border-2 border-gray-200"}`}>
                  {isActive && <span className="text-white text-xs">✓</span>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isActive ? "text-gray-400 line-through" : "text-gray-900 font-medium"}`}>
                      Subscribe to get full access
                    </span>
                    {!isActive && (
                      <button onClick={() => setShowPlanPicker(true)} className="text-xs bg-black text-white px-3 py-1 rounded-full hover:bg-gray-800">Subscribe $35/mo →</button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">14-day free trial included. Cancel anytime.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-green-900">You're all set! 🎉</p>
                <p className="text-sm text-green-700 mt-1">OwnerReply is monitoring your reviews and ready to draft responses.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <a href="/settings" className="bg-white border border-green-200 rounded-xl p-3 text-center hover:border-green-400 transition-all">
                <p className="text-xs font-medium text-gray-900">⚙️ Settings</p>
                <p className="text-xs text-gray-500 mt-0.5">Adjust your tone</p>
              </a>
              <a href="/templates" className="bg-white border border-green-200 rounded-xl p-3 text-center hover:border-green-400 transition-all">
                <p className="text-xs font-medium text-gray-900">📝 Templates</p>
                <p className="text-xs text-gray-500 mt-0.5">Save responses</p>
              </a>
              <a href="/history" className="bg-white border border-green-200 rounded-xl p-3 text-center hover:border-green-400 transition-all">
                <p className="text-xs font-medium text-gray-900">📊 History</p>
                <p className="text-xs text-gray-500 mt-0.5">View past responses</p>
              </a>
            </div>
          </div>
        )}
        {isTrialing && trialDaysLeft <= 3 && trialDaysLeft > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
            <p className="text-amber-800 text-sm font-medium">Your trial ends in {trialDaysLeft} days. Subscribe to keep access.</p>
          </div>
        )}
        {isTrialing && trialDaysLeft <= 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <p className="text-red-800 text-sm font-medium">Your trial has expired. Subscribe to continue using OwnerReply.</p>
            <button onClick={() => setShowPlanPicker(true)} className="bg-black text-white px-4 py-2 rounded-full text-xs hover:bg-gray-800">
              Subscribe $35/mo
            </button>
          </div>
        )}
        {reviews.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-4">Review Analytics</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{totalReviews}</p>
                <p className="text-xs text-gray-500 mt-1">Total reviews</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{avgRating}</p>
                <p className="text-xs text-gray-500 mt-1">Average rating</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{responseRate}%</p>
                <p className="text-xs text-gray-500 mt-1">Response rate</p>
              </div>
            </div>
            <div className="space-y-2">
              {ratingBreakdown.map(({ star, count, percent }) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-6">{star}★</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-amber-400 h-2 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {referralCode && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-semibold text-gray-900">🎁 Refer a business — get a free month</h2>
                <p className="text-sm text-gray-500 mt-1">Share your referral link. When a friend subscribes you both get one month free.</p>
              </div>
              {referralCount > 0 && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{referralCount}</p>
                  <p className="text-xs text-gray-500">referral{referralCount !== 1 ? "s" : ""}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                <p className="text-xs text-gray-400 mb-0.5">Your referral link</p>
                <p className="text-sm text-gray-900 font-mono">{`https://getownerreply.com/?ref=${referralCode}`}</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://getownerreply.com/?ref=${referralCode}`);
                  setReferralCopied(true);
                  setTimeout(() => setReferralCopied(false), 2000);
                }}
                className="bg-black text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-800 whitespace-nowrap"
              >
                {referralCopied ? "Copied! ✓" : "Copy link"}
              </button>
            </div>
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
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900 text-sm">{review.reviewer?.displayName || "Anonymous"}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSentiment(review.starRating).color}`}>
                      {getSentiment(review.starRating).label}
                    </span>
                  </div>
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
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-gray-400">AI draft:</p>
                        <button
                          onClick={() => handleSaveTemplate(review.reviewId)}
                          className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 px-2 py-0.5 rounded-full hover:bg-white"
                        >
                          Save as template
                        </button>
                      </div>
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

      {showCancelFlow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            {cancelStep === 1 && (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Before you go...</h2>
                <p className="text-sm text-gray-500 mb-6">We're sorry to see you leave. Can you tell us why you're cancelling? This helps us improve.</p>
                <div className="space-y-2 mb-6">
                  {[
                    "Too expensive",
                    "Not enough reviews to justify it",
                    "Switching to a different tool",
                    "My business is closed or pausing",
                    "Missing a feature I need",
                    "Other",
                  ].map(reason => (
                    <button
                      key={reason}
                      onClick={() => setCancelReason(reason)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all text-gray-900 ${
                        cancelReason === reason
                          ? "border-black bg-gray-50 font-medium"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (!cancelReason) return;
                      if (cancelReason === "Too expensive" && !business?.discount_offered && business?.stripe_subscription_id) {
                        setCancelStep(2);
                      } else {
                        handleCancelFlowSubmit(false);
                      }
                    }}
                    disabled={!cancelReason}
                    className="flex-1 bg-black text-white py-2 rounded-full text-sm hover:bg-gray-800 disabled:opacity-50"
                  >
                    Continue
                  </button>
                  <button
                    onClick={() => {
                      setShowCancelFlow(false);
                      setCancelReason("");
                      setCancelStep(1);
                    }}
                    className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-full text-sm hover:bg-gray-50"
                  >
                    Never mind
                  </button>
                </div>
              </>
            )}
            {cancelStep === 2 && (
              <>
                <div className="text-center mb-6">
                  <p className="text-3xl mb-3">🎁</p>
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Special offer just for you</h2>
                  <p className="text-sm text-gray-500 mb-4">We hear you — price matters. Stay with OwnerReply at a reduced rate:</p>
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4">
                    <p className="text-3xl font-bold text-green-700">$25<span className="text-lg font-normal">/mo</span></p>
                    <p className="text-sm text-green-600">for the next 2 months</p>
                    <p className="text-xs text-green-500 mt-1">Save $20 total — then back to $35/mo</p>
                  </div>
                  <p className="text-xs text-gray-400">This offer is available once and won't appear again.</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleCancelFlowSubmit(true)}
                    disabled={applyingDiscount}
                    className="flex-1 bg-black text-white py-2 rounded-full text-sm hover:bg-gray-800 disabled:opacity-50"
                  >
                    {applyingDiscount ? "Applying..." : "Accept offer 🎉"}
                  </button>
                  <button
                    onClick={() => handleCancelFlowSubmit(false)}
                    disabled={applyingDiscount}
                    className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-full text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    No thanks, cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {showPlanPicker && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
      <h2 className="text-lg font-bold text-gray-900 mb-2">Choose your plan</h2>
      <p className="text-sm text-gray-500 mb-6">All plans include a 14-day free trial. Cancel anytime.</p>
      <div className="space-y-3 mb-6">
        <button
          onClick={() => { setShowPlanPicker(false); handleSubscribe("followup"); }}
          disabled={subscribing}
          className="w-full text-left px-4 py-4 rounded-xl border-2 border-gray-200 hover:border-black transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">🔨 Second Knock</p>
              <p className="text-xs text-gray-500 mt-0.5">Estimate follow-ups & customer win-back</p>
            </div>
            <p className="font-bold text-gray-900">$29/mo</p>
          </div>
        </button>
        <button
          onClick={() => { setShowPlanPicker(false); handleSubscribe("reviews"); }}
          disabled={subscribing}
          className="w-full text-left px-4 py-4 rounded-xl border-2 border-gray-200 hover:border-black transition-all"
        >
          <div className="w-full text-left px-4 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 cursor-not-allowed">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-400">⭐ Google Review Replies</p>
            <p className="text-xs text-gray-400 mt-0.5">AI responses posted to Google with one click</p>
          </div>
          <p className="font-bold text-gray-400">🚀 July 5th</p>
        </div>
      </div>
        </button>
        <button
          onClick={() => { setShowPlanPicker(false); handleSubscribe("both"); }}
          disabled={subscribing}
          className="w-full text-left px-4 py-4 rounded-xl border-2 border-green-400 hover:border-green-600 transition-all relative"
        >
          <span className="absolute -top-2.5 left-4 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">Best value</span>
          <div className="w-full text-left px-4 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 cursor-not-allowed relative">
  <span className="absolute -top-2.5 left-4 bg-gray-300 text-white text-xs font-semibold px-2 py-0.5 rounded-full">Available July 5th</span>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-400">✨ Both Tools</p>
          <p className="text-xs text-gray-400 mt-0.5">Full access to everything — save $15/mo</p>
        </div>
        <p className="font-bold text-gray-400">$49/mo</p>
      </div>
    </div>
        </button>
      </div>
      <button
        onClick={() => setShowPlanPicker(false)}
        className="w-full border border-gray-200 text-gray-600 py-2 rounded-full text-sm hover:bg-gray-50"
      >
        Cancel
      </button>
    </div>
  </div>
)}


      <footer className="border-t border-gray-100 px-8 py-6 text-center mt-8">
        <div className="flex justify-center gap-6 text-sm text-gray-400 flex-wrap">
          <a href="/blog" className="hover:text-gray-600">Blog</a>
          <a href="/privacy" className="hover:text-gray-600">Privacy Policy</a>
          <a href="/terms" className="hover:text-gray-600">Terms of Service</a>
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