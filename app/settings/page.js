"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Settings() {
  const { user } = useUser();
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [tone, setTone] = useState("professional");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.business) {
        setBusinessName(data.business.business_name || "");
        setTone(data.business.tone || "professional");
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, tone }),
      });
      setSaved(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Error saving settings:", err);
    }
    setSaving(false);
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400 text-sm">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-gray-900">OwnerReply</span>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">Back to dashboard</Link>
      </nav>
      <main className="max-w-2xl mx-auto px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-1">Business name</h2>
          <p className="text-sm text-gray-500 mb-4">Used by AI to personalize responses. e.g. "Mario's Pizza"</p>
          <input
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            style={{ color: '#000000', backgroundColor: '#ffffff' }}
            placeholder="Your business name"
          />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-1">Response tone</h2>
          <p className="text-sm text-gray-500 mb-4">Choose how you want AI to sound when responding to reviews.</p>
          <div className="grid grid-cols-3 gap-3">
            {["professional", "friendly", "apologetic"].map(t => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`p-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                  tone === t
                    ? "border-black bg-black text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-400">
            {tone === "professional" && "Polished and formal. Great for most businesses."}
            {tone === "friendly" && "Warm and conversational. Great for restaurants and salons."}
            {tone === "apologetic" && "Empathetic and apologetic. Best for negative reviews."}
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-black text-white px-6 py-2 rounded-full text-sm hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "Saved! Redirecting..." : "Save settings"}
        </button>
      </main>
    </div>
  );
}