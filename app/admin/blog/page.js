"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // list, new, edit
  const [editPost, setEditPost] = useState(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    published: false,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/blog/admin");
      const data = await res.json();
      if (data.posts) setPosts(data.posts);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
    setLoading(false);
  }

  function generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  }

  function handleTitleChange(e) {
    const title = e.target.value;
    setForm(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      if (editPost) {
        await fetch(`/api/blog/${editPost.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        setMessage("Post updated successfully!");
      } else {
        await fetch("/api/blog/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        setMessage("Post created successfully!");
      }
      await fetchPosts();
      setTimeout(() => {
        setView("list");
        setMessage("");
        setForm({ title: "", slug: "", description: "", content: "", published: false });
        setEditPost(null);
      }, 1500);
    } catch (err) {
      setMessage("Error saving post.");
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    await fetch(`/api/blog/${id}`, { method: "DELETE" });
    fetchPosts();
  }

  function handleEdit(post) {
    setEditPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      description: post.description || "",
      content: post.content,
      published: post.published,
    });
    setView("edit");
  }

  function handleNew() {
    setEditPost(null);
    setForm({ title: "", slug: "", description: "", content: "", published: false });
    setView("new");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-gray-900">OwnerReply — Blog Admin</span>
        <div className="flex gap-4">
          <Link href="/blog" target="_blank" className="text-sm text-gray-500 hover:text-gray-900">View Blog →</Link>
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900">Admin</Link>
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">Dashboard</Link>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-8 py-12">
        {view === "list" && (
          <>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
              <button onClick={handleNew} className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800">
                + New Post
              </button>
            </div>
            {loading && <p className="text-gray-400 text-sm">Loading posts...</p>}
            {!loading && posts.length === 0 && (
              <p className="text-gray-400 text-sm">No posts yet. Create your first one!</p>
            )}
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold text-gray-900">{post.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">/blog/{post.slug}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(post)} className="text-sm text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(post.id)} className="text-sm text-red-400 hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {(view === "new" || view === "edit") && (
          <>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-900">{view === "new" ? "New Post" : "Edit Post"}</h1>
              <button onClick={() => setView("list")} className="text-sm text-gray-500 hover:text-gray-900">← Back to posts</button>
            </div>
            {message && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-6">
                <p className="text-green-800 text-sm">{message}</p>
              </div>
            )}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">Title</label>
                <input
                  value={form.title}
                  onChange={handleTitleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900"
                  placeholder="Article title"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                />
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">Slug (URL)</label>
                <input
                  value={form.slug}
                  onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900"
                  placeholder="article-url-slug"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                />
                <p className="text-xs text-gray-400 mt-1">getownerreply.com/blog/{form.slug}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">Description (for SEO)</label>
                <input
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900"
                  placeholder="Brief description of the article"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                />
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">Content</label>
                <p className="text-xs text-gray-400 mb-3">Use **bold text** for headings. Separate paragraphs with a blank line.</p>
                <textarea
                  value={form.content}
                  onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 resize-none"
                  placeholder="Write your article here..."
                  rows={20}
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                />
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Published</p>
                  <p className="text-sm text-gray-500">Toggle to make this post visible on the blog</p>
                </div>
                <button
                  onClick={() => setForm(prev => ({ ...prev, published: !prev.published }))}
                  className={`w-12 h-6 rounded-full transition-colors ${form.published ? "bg-black" : "bg-gray-200"}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${form.published ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-black text-white py-3 rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? "Saving..." : view === "new" ? "Publish Post" : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}