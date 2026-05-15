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
  const [showEstimateContext, setShowEstimateContext] = useState(false);
  const [showWinbackContext, setShowWinbackContext] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState(null);
  const [historyCopied, setHistoryCopied] = useState({});

async function fetchHistory() {
  setHistoryLoading(true);
  try {
    const res = await fetch("/api/followup-history");
    const data = await res.json();
    if (data.history) setHistory(data.history);
  } catch (err) {
    console.error("History fetch error:", err);
  }
  setHistoryLoading(false);
}

function historyCopy(text, key) {
  navigator.clipboard.writeText(text);
  setHistoryCopied(p => ({ ...p, [key]: true }));
  setTimeout(() => setHistoryCopied(p => ({ ...p, [key]: false })), 2000);
}

  const [estimateForm, setEstimateForm] = useState({
    customerName: "", jobType: "HVAC", estimateAmount: "",
    daysSince: "", tone: "friendly", notes: "",
    callWentHow: "", customerSaid: "", concerns: "", extraContext: "",
  });

  const [winbackForm, setWinbackForm] = useState({
    customerName: "", lastJobType: "HVAC", timeAgo: "6 months",
    reason: "maintenance", tone: "friendly",
    jobWentHow: "", memorableDetails: "", whyNeedYou: "", extraContext: "",
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
          <span className="hidden md:block text-sm text-gray-900 font-medium">Second Knock</span>
          <a href="/settings" className="hidden md:block text-sm text-gray-500 hover:text-gray-900">Settings</a>
        </div>
        <UserButton afterSignOutUrl="/" />
      </nav>

      <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Second Knock</h1>
          <p className="text-gray-500 text-sm mt-1">Follow up on estimates and win back past customers — email, text, and voicemail in seconds.</p>
        </div>

        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
          <button type="button"
            onClick={() => { setActiveTab("estimate"); setMessages(null); setError(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "estimate" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            Estimate Follow-Up
          </button>
          <button type="button"
            onClick={() => { setActiveTab("winback"); setMessages(null); setError(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "winback" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            Customer Win-Back
          </button>
          <button type="button"
            onClick={() => { setActiveTab("history"); setMessages(null); setError(null); fetchHistory(); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "history" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            History
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">

          {activeTab === "estimate" && (
            <div className="space-y-4">
              {/* Basic fields */}
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
                <div className="flex gap-2 flex-wrap">
                  {["friendly", "professional", "urgent"].map(t => (
                    <button type="button" key={t}
                      onClick={() => setEstimateForm(p => ({ ...p, tone: t }))}
                      className={`px-4 py-2 rounded-full text-xs font-medium border capitalize transition-all ${estimateForm.tone === t ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Structured context fields */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer Context <span className="font-normal normal-case text-gray-400">— the more you add, the better the message</span></p>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">How did the initial conversation go?</label>
                  <select value={estimateForm.callWentHow}
                    onChange={e => setEstimateForm(p => ({ ...p, callWentHow: e.target.value }))}
                    className={selectClass}>
                    <option value="">Select (optional)</option>
                    <option value="great">Great — they seemed very interested</option>
                    <option value="good">Good — seemed interested, no red flags</option>
                    <option value="hesitant">Mixed — had some hesitation</option>
                    <option value="concerned">They had specific concerns</option>
                    <option value="nospoke">We haven't spoken — estimate was sent cold</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">What did they say or ask about? <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input type="text"
                    placeholder='e.g. "Said they were getting 3 quotes" or "Asked about financing"'
                    value={estimateForm.customerSaid}
                    onChange={e => setEstimateForm(p => ({ ...p, customerSaid: e.target.value }))}
                    className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Any specific concerns mentioned? <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input type="text"
                    placeholder='e.g. "Worried about the price" or "Timing was an issue"'
                    value={estimateForm.concerns}
                    onChange={e => setEstimateForm(p => ({ ...p, concerns: e.target.value }))}
                    className={inputClass} />
                </div>
              </div>

              {/* Extra context toggle */}
              <button type="button"
                onClick={() => setShowEstimateContext(p => !p)}
                className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-all">
                {showEstimateContext ? "▲ Hide" : "▼ Add more context"}
              </button>
              {showEstimateContext && (
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Anything else the AI should know?</label>
                  <textarea
                    rows={3}
                    placeholder="Paste in what the customer emailed or texted, or add any other details that might help personalize the message..."
                    value={estimateForm.extraContext}
                    onChange={e => setEstimateForm(p => ({ ...p, extraContext: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 bg-white resize-none"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === "winback" && (
            <div className="space-y-4">
              {/* Basic fields */}
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
                <div className="flex gap-2 flex-wrap">
                  {["friendly", "professional", "casual"].map(t => (
                    <button type="button" key={t}
                      onClick={() => setWinbackForm(p => ({ ...p, tone: t }))}
                      className={`px-4 py-2 rounded-full text-xs font-medium border capitalize transition-all ${winbackForm.tone === t ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Structured context fields */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer Context <span className="font-normal normal-case text-gray-400">— the more you add, the better the message</span></p>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">How did the last job go?</label>
                  <select value={winbackForm.jobWentHow}
                    onChange={e => setWinbackForm(p => ({ ...p, jobWentHow: e.target.value }))}
                    className={selectClass}>
                    <option value="">Select (optional)</option>
                    <option value="great">Great — they were very happy</option>
                    <option value="good">Good — no issues, smooth job</option>
                    <option value="minorissue">Had a minor issue we resolved</option>
                    <option value="complicated">It was complicated</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Anything memorable about this customer? <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input type="text"
                    placeholder='e.g. "Mentioned wanting to redo the bathroom" or "Always very friendly"'
                    value={winbackForm.memorableDetails}
                    onChange={e => setWinbackForm(p => ({ ...p, memorableDetails: e.target.value }))}
                    className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Why might they need you again? <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input type="text"
                    placeholder='e.g. "Seasonal service due" or "They mentioned a second job"'
                    value={winbackForm.whyNeedYou}
                    onChange={e => setWinbackForm(p => ({ ...p, whyNeedYou: e.target.value }))}
                    className={inputClass} />
                </div>
              </div>

              {/* Extra context toggle */}
              <button type="button"
                onClick={() => setShowWinbackContext(p => !p)}
                className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-all">
                {showWinbackContext ? "▲ Hide" : "▼ Add more context"}
              </button>
              {showWinbackContext && (
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Anything else the AI should know?</label>
                  <textarea
                    rows={3}
                    placeholder="Paste in any emails or texts from this customer, or add any other details that might help personalize the message..."
                    value={winbackForm.extraContext}
                    onChange={e => setWinbackForm(p => ({ ...p, extraContext: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 bg-white resize-none"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
  <div>
    {historyLoading && (
      <div className="text-center py-12 text-gray-400 text-sm">Loading history...</div>
    )}
    {!historyLoading && history.length === 0 && (
      <div className="text-center py-12">
        <p className="text-gray-400 text-sm">No messages generated yet.</p>
        <p className="text-gray-400 text-xs mt-1">Your generated messages will appear here.</p>
      </div>
    )}
    {!historyLoading && history.length > 0 && (
      <div className="space-y-3">
        {history.map((item) => (
          <div key={item.id} className="border border-gray-100 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedHistory(expandedHistory === item.id ? null : item.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.type === "estimate" ? "📋" : "🔁"}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.customer_name}</p>
                  <p className="text-xs text-gray-400">
                    {item.job_type}
                    {item.estimate_amount ? ` · $${item.estimate_amount}` : ""}
                    {" · "}
                    {item.type === "estimate" ? "Estimate Follow-Up" : "Win-Back"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="text-gray-400 text-xs">{expandedHistory === item.id ? "▲" : "▼"}</span>
              </div>
            </button>

            {expandedHistory === item.id && (
              <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50">
                {/* Email */}
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>📧</span>
                      <p className="text-xs font-semibold text-gray-700">Email</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => historyCopy(`Subject: ${item.email_subject}\n\n${item.email_body}`, `email-${item.id}`)}
                      className="text-xs border border-gray-200 px-3 py-1 rounded-full hover:bg-gray-50 text-gray-500"
                    >
                      {historyCopied[`email-${item.id}`] ? "Copied ✓" : "Copy"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Subject</p>
                  <p className="text-sm text-gray-900 font-medium mb-2">{item.email_subject}</p>
                  <p className="text-xs text-gray-400 mb-1">Body</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{item.email_body}</p>
                </div>

                {/* Text */}
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>💬</span>
                      <p className="text-xs font-semibold text-gray-700">Text Message</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => historyCopy(item.text_message, `text-${item.id}`)}
                      className="text-xs border border-gray-200 px-3 py-1 rounded-full hover:bg-gray-50 text-gray-500"
                    >
                      {historyCopied[`text-${item.id}`] ? "Copied ✓" : "Copy"}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{item.text_message}</p>
                </div>

                {/* Voicemail */}
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>📞</span>
                      <p className="text-xs font-semibold text-gray-700">Voicemail Script</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => historyCopy(item.voicemail, `voicemail-${item.id}`)}
                      className="text-xs border border-gray-200 px-3 py-1 rounded-full hover:bg-gray-50 text-gray-500"
                    >
                      {historyCopied[`voicemail-${item.id}`] ? "Copied ✓" : "Copy"}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{item.voicemail}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
)}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {activeTab !== "history" && (
            <button type="button" onClick={handleGenerate} disabled={loading || !canGenerate}
              className="mt-6 w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-40 transition-all">
              {loading ? "Generating messages..." : "Generate Messages"}
            </button>
          )}
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