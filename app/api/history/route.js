import { auth } from "@clerk/nextjs/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const businesses = await sql`
      SELECT * FROM businesses WHERE clerk_user_id = ${userId}
    `;

    if (!businesses.length) {
      return Response.json({ error: "Business not found" }, { status: 404 });
    }

    const business = businesses[0];

    const history = await sql`
      SELECT 
        r.id,
        r.reviewer_name,
        r.rating,
        r.review_text,
        r.review_date,
        rd.draft_text,
        rd.posted_at
      FROM reviews r
      JOIN response_drafts rd ON rd.review_id = r.id
      WHERE r.business_id = ${business.id}
        AND rd.posted_at IS NOT NULL
      ORDER BY rd.posted_at DESC
    `;

    return Response.json({ history });
  } catch (error) {
    console.error("History fetch error:", error);
    return Response.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}