import { auth } from "@clerk/nextjs/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const businesses = await sql`
      SELECT id FROM businesses WHERE clerk_user_id = ${userId}
    `;
    if (!businesses.length) return Response.json({ templates: [] });

    const templates = await sql`
      SELECT * FROM response_templates 
      WHERE business_id = ${businesses[0].id}
      ORDER BY created_at DESC
    `;

    return Response.json({ templates });
  } catch (error) {
    console.error("Templates fetch error:", error);
    return Response.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { name, content, tone } = await request.json();

    const businesses = await sql`
      SELECT id FROM businesses WHERE clerk_user_id = ${userId}
    `;
    if (!businesses.length) return Response.json({ error: "Business not found" }, { status: 404 });

    const templates = await sql`
      INSERT INTO response_templates (business_id, name, content, tone)
      VALUES (${businesses[0].id}, ${name}, ${content}, ${tone || 'professional'})
      RETURNING *
    `;

    return Response.json({ template: templates[0] });
  } catch (error) {
    console.error("Template create error:", error);
    return Response.json({ error: "Failed to create template" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await request.json();

    const businesses = await sql`
      SELECT id FROM businesses WHERE clerk_user_id = ${userId}
    `;
    if (!businesses.length) return Response.json({ error: "Business not found" }, { status: 404 });

    await sql`
      DELETE FROM response_templates 
      WHERE id = ${id} AND business_id = ${businesses[0].id}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Template delete error:", error);
    return Response.json({ error: "Failed to delete template" }, { status: 500 });
  }
}