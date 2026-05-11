"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();
      if (data.templates) setTemplates(data.templates);
    } catch (err) {
      console.error("Templates error:", err);
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!name.trim() || !content.trim()) {
      setMessage("Please enter a name and content.");
      return;
    }
    setSaving(true);
    try {
      await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, content }),
      });
      setName("");
      setContent("");
      setShowNew(false);
      setMessage("Template saved!");
      fetchTemplates();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error saving template.");
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this template?")) return;
    await fetch("/api/templates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchTemplates();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-xl font-bold text-gray-900">OwnerReply</span>
          <a href="/dashboard" className="hidden md:block text-sm text-gray-500 hover:text-gray-900">Dashboard</a>
          <a href="/history" className="hidden md:block text-sm text-gray-500 hover:text-gray-900">History</a>
          <a href="/settings" className="hidden md:block text-sm text-gray-500 hover:text-gray-900">Settings</a>
          <a href="/blog" className="hidden md:block text-sm text-gray-500 hover:text-gray-900">Blog</a>
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Response Templates</h1>
            <p className="text-sm text-gray-500 mt-1">Save your favorite responses to reuse anytime.</p>
          </div>
          <button
            onClick={() => setShowNew(!showNew)}
            className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800"
          >
            + New Template
          </button>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-6">
            <p className="text-green-800 text-sm">{message}</p>
          </div>
        )}

        {showNew && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">New Template</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900"
                  placeholder="e.g. 5-star thank you, Negative response, Food complaint"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Response content</label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 resize-none"
                  placeholder="Write your template response here..."
                  rows={5}
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Template"}
                </button>
                <button
                  onClick={() => setShowNew(false)}
                  className="border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && <p className="text-gray-400 text-sm">Loading templates...</p>}

        {!loading && templates.length === 0 && !showNew && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-gray-400 text-sm mb-4">No templates yet.</p>
            <button
              onClick={() => setShowNew(true)}
              className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800"
            >
              Create your first template
            </button>
          </div>
        )}

        <div className="space-y-4">
          {templates.map(template => (
            <div key={template.id} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-3">
                <p className="font-semibold text-gray-900">{template.name}</p>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{template.content}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(template.content);
                  setMessage("Copied to clipboard!");
                  setTimeout(() => setMessage(""), 2000);
                }}
                className="mt-3 text-xs text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-1 rounded-full hover:bg-gray-50"
              >
                Copy to clipboard
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}