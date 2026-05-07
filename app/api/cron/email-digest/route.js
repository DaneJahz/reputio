import sql from "@/lib/db";
import { sendWeeklyDigest } from "@/lib/email";

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const businesses = await sql`
      SELECT * FROM businesses
      WHERE subscription_status IN ('active', 'trial')
      AND email IS NOT NULL
    `;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let sent = 0;

    for (const business of businesses) {
      try {
        const newReviews = await sql`
          SELECT * FROM reviews
          WHERE business_id = ${business.id}
            AND review_date >= ${oneWeekAgo.toISOString()}
          ORDER BY review_date DESC
        `;

        const unanswered = await sql`
          SELECT COUNT(*) as count FROM reviews r
          LEFT JOIN response_drafts rd ON rd.review_id = r.id AND rd.posted_at IS NOT NULL
          WHERE r.business_id = ${business.id}
            AND rd.id IS NULL
        `;

        const allReviews = await sql`
          SELECT rating FROM reviews WHERE business_id = ${business.id}
        `;

        const avgRating = allReviews.length > 0
          ? allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / allReviews.length
          : 0;

        await sendWeeklyDigest({
          businessEmail: business.email,
          businessName: business.business_name || business.name,
          newReviews,
          unansweredCount: Number(unanswered[0]?.count || 0),
          averageRating: avgRating,
        });

        sent++;
      } catch (err) {
        console.error(`Digest error for business ${business.id}:`, err);
      }
    }

    return Response.json({ success: true, sent });
  } catch (error) {
    console.error("Weekly digest error:", error);
    return Response.json({ error: "Failed to send digests" }, { status: 500 });
  }
}