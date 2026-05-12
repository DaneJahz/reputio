"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

const jobTypes = ["HVAC", "Plumbing", "Electrical", "Roofing", "Landscaping", "Painting", "General Contracting", "Cleaning", "Other"];

export default function FollowUpTool() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("estimate");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(null);
  const [copied, setCopied] = useState({});
  const [error, setError] = useState(null);

  const [estimateForm, setEstimateForm] = useState({
    customerName: "", jobType: "HVAC", estimateAmount: "",
    daysSince: "", tone: "friendly", notes: "",
  });

  const [winbackForm, setWinbackForm] = useState({
    customerName: "", lastJobType: "HVAC", timeAgo: "6 months",
    reason: "maintenance", tone: "friendly",
  });

  useEffect(() => {
    async function registerBusiness() {
      try {
        await fetch("/api/register-business", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user?.fullName || user?.primaryEmailAddress?.emailAddress || "Business",
            email: user?.primaryEmailAddress?.emailAddress || "",
          }),
        });
      } catch (err) {
        console.error("Register error:", err);
      }
    }
    if (user) registerBusiness();
  }, [user]);

  async function handleGenerate() {
    setLoading(true);
    setMessages(null);
    setError(null);
    try {
      const res = await fetch("/api/generate-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeTab,
          data: activeTab === "estimate" ? estimateForm : winbackForm,
        }),
      });
      const data = await res.json();
      if (data.error === "subscription_required") {
        setError("Your trial has expired. Please subscribe to continue.");
        return;
      }
      if (data.error) {
        setError(data.error);
        return;
      }
      if (data.messages) setMessages(data.messages);
    } catch (err) {
      console.error("Generate error:", err);
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  function copy(text, key) {
    navigator.clipboard.writeText(text);
    setCopied(p => ({ ...p, [key]: true }));
    setTimeout(() => setCopied(p => ({ ...p, [key]: false })), 2000);
  }

  const canGenerate = activeTab === "estimate"
    ? estimateForm.customerName.trim() !== "" && estimateForm.estimateAmount !== "" && estimateForm.daysSince !== ""
    : winbackForm.customerName.trim() !== "";

  const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 bg-white";
  const selectClass = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-400 bg-white";

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/dashboard" className="text-xl font-bold text-gray-900">OwnerReply</a>
          <a href="/dashboard" className="hidden md:block text-sm text-gray-500 hover:text-gray-900">Review Replies</a>
          <span className="hidden md:block text-sm text-gray-900 font-medium">Follow-Up</span>
          <a href="/settings" className="hidden md:block text-sm text-gray-500 hover:text-gray-900">Settings</a>
        </div>
        <UserButton afterSignOutUrl="/" />
      </nav>

      <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Follow-Up Messages</h1>
          <p className="text-gray-500 text-sm mt-1">Generate ready-to-send emails, texts, and voicemail scripts in seconds.</p>
        </div>

        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => { setActiveTab("estimate"); setMessages(null); setError(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "estimate" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Estimate Follow-Up
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("winback"); setMessages(null); setError(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "winback" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Customer Win-Back
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          {activeTab === "estimate" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Customer Name</label>
                  <input type="text" placeholder="John Smith" value={estimateForm.customerName}
                    onChange={e => setEstimateForm(p => ({ ...p, customerName: e.target.value }))}
                    className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Job Type</label>
                  <select value={estimateForm.jobType}
                    onChange={e => setEstimateForm(p => ({ ...p, jobType: e.target.value }))}
                    className={selectClass}>
                    {jobTypes.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Estimate Amount ($)</label>
                  <input type="number" placeholder="2500" value={estimateForm.estimateAmount}
                    onChange={e => setEstimateForm(p => ({ ...p, estimateAmount: e.target.value }))}
                    className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Days Since Sent</label>
                  <input type="number" placeholder="7" value={estimateForm.daysSince}
                    onChange={e => setEstimateForm(p => ({ ...p, daysSince: e.target.value }))}
                    className={inputClass} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">Tone</label>
                <div className="flex gap-2">
                  {["friendly", "professional", "urgent"].map(t => (
                    <button type="button" key={t}
                      onClick={() => setEstimateForm(p => ({ ...p, tone: t }))}
                      className={`px-4 py-2 rounded-full text-xs font-medium border capitalize transition-all ${estimateForm.tone === t ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="text" placeholder="e.g. They mentioned budget concerns..."
                  value={estimateForm.notes}
                  onChange={e => setEstimateForm(p => ({ ...p, notes: e.target.value }))}
                  className={inputClass} />
              </div>
            </div>
          )}

          {activeTab === "winback" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Customer Name</label>
                  <input type="text" placeholder="John Smith" value={winbackForm.customerName}
                    onChange={e => setWinbackForm(p => ({ ...p, customerName: e.target.value }))}
                    className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Last Job Type</label>
                  <select value={winbackForm.lastJobType}
                    onChange={e => setWinbackForm(p => ({ ...p, lastJobType: e.target.value }))}
                    className={selectClass}>
                    {jobTypes.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">How Long Ago</label>
                  <select value={winbackForm.timeAgo}
                    onChange={e => setWinbackForm(p => ({ ...p, timeAgo: e.target.value }))}
                    className={selectClass}>
                    {["3 months", "6 months", "1 year", "2 years", "over 2 years"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Reason to Reach Out</label>
                  <select value={winbackForm.reason}
                    onChange={e => setWinbackForm(p => ({ ...p, reason: e.target.value }))}
                    className={selectClass}>
                    <option value="maintenance">Seasonal maintenance</option>
                    <option value="checkup">Annual checkup / inspection</option>
                    <option value="newservice">New service available</option>
                    <option value="checkin">General check-in</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">Tone</label>
                <div className="flex gap-2">
                  {["friendly", "professional", "casual"].map(t => (
                    <button type="button" key={t}
                      onClick={() => setWinbackForm(p => ({ ...p, tone: t }))}
                      className={`px-4 py-2 rounded-full text-xs font-medium border capitalize transition-all ${winbackForm.tone === t ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !canGenerate}
            className="mt-6 w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-40 transition-all"
          >
            {loading ? "Generating messages..." : "Generate Messages"}
          </button>
        </div>

        {messages && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <h3 className="text-sm font-semibold text-gray-900">Email</h3>
                </div>
                <button type="button"
                  onClick={() => copy(`Subject: ${messages.email?.subject}\n\n${messages.email?.body}`, "email")}
                  className="text-xs border border-gray-200 px-3 py-1 rounded-full hover:bg-gray-50 text-gray-500">
                  {copied.email ? "Copied ✓" : "Copy"}
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 mb-2">
                <p className="text-xs text-gray-400 mb-1">Subject</p>
                <p className="text-sm text-gray-900 font-medium">{messages.email?.subject}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Body</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{messages.email?.body}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span>💬</span>
                  <h3 className="text-sm font-semibold text-gray-900">Text Message</h3>
                </div>
                <button type="button"
                  onClick={() => copy(messages.text, "text")}
                  className="text-xs border border-gray-200 px-3 py-1 rounded-full hover:bg-gray-50 text-gray-500">
                  {copied.text ? "Copied ✓" : "Copy"}
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-sm text-gray-700">{messages.text}</p>
                <p className="text-xs text-gray-400 mt-2">{messages.text?.length} characters</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <h3 className="text-sm font-semibold text-gray-900">Voicemail Script</h3>
                </div>
                <button type="button"
                  onClick={() => copy(messages.voicemail, "voicemail")}
                  className="text-xs border border-gray-200 px-3 py-1 rounded-full hover:bg-gray-50 text-gray-500">
                  {copied.voicemail ? "Copied ✓" : "Copy"}
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-sm text-gray-700">{messages.voicemail}</p>
              </div>
            </div>

            <button type="button" onClick={handleGenerate} disabled={loading}
              className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl text-sm hover:bg-gray-50 transition-all disabled:opacity-40">
              {loading ? "Regenerating..." : "Regenerate messages"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}