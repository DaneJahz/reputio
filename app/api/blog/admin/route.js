import { auth } from "@clerk/nextjs/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const posts = await sql`
      SELECT id, title, slug, description, author, published, created_at
      FROM blog_posts
      ORDER BY created_at DESC
    `;
    return Response.json({ posts });
  } catch (error) {
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}