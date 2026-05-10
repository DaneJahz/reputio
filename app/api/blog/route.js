import sql from "@/lib/db";

export async function GET() {
  try {
    const posts = await sql`
      SELECT id, title, slug, description, author, published, created_at
      FROM blog_posts
      WHERE published = true
      ORDER BY created_at DESC
    `;
    return Response.json({ posts });
  } catch (error) {
    console.error("Blog fetch error:", error);
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}