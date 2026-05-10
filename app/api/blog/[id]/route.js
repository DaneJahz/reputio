import { auth } from "@clerk/nextjs/server";
import sql from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const posts = await sql`
      SELECT * FROM blog_posts WHERE id = ${params.id}
    `;
    if (!posts.length) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ post: posts[0] });
  } catch (error) {
    return Response.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { title, slug, description, content, published } = await request.json();

    const posts = await sql`
      UPDATE blog_posts
      SET title = ${title},
          slug = ${slug},
          description = ${description},
          content = ${content},
          published = ${published},
          updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `;
    return Response.json({ post: posts[0] });
  } catch (error) {
    return Response.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    await sql`DELETE FROM blog_posts WHERE id = ${params.id}`;
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Failed to delete post" }, { status: 500 });
  }
}