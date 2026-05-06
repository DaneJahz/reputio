import { auth } from "@clerk/nextjs/server";
import sql from "@/lib/db";

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email } = await request.json();

    if (!name || !email) {
      return Response.json({ error: "Name and email required" }, { status: 400 });
    }

    const existing = await sql`
      SELECT id FROM businesses WHERE clerk_user_id = ${userId}
    `;

    if (existing.length > 0) {
      return Response.json({ business: existing[0] });
    }

    const business = await sql`
      INSERT INTO businesses (name, email, clerk_user_id, subscription_status, trial_ends_at)
      VALUES (${name}, ${email}, ${userId}, 'trial', NOW() + INTERVAL '14 days')
      RETURNING *
    `;

    return Response.json({ business: business[0] });
  } catch (error) {
    console.error("Register business error:", error);
    return Response.json({ error: "Failed to register business" }, { status: 500 });
  }
}