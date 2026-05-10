import { auth } from "@clerk/nextjs/server";
import sql from "@/lib/db";

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { title, slug, description, content, published } = await request.json();

    const posts = await sql`
      INSERT INTO blog_posts (title, slug, description, content, published)
      VALUES (${title}, ${slug}, ${description}, ${content}, ${published})
      RETURNING *
    `;
    return Response.json({ post: posts[0] });
  } catch (error) {
    console.error("Blog create error:", error);
    return Response.json({ error: "Failed to create post" }, { status: 500 });
  }
}