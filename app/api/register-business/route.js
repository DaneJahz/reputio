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

    // Check if business already exists for this user
    const existing = await sql`
      SELECT * FROM businesses WHERE clerk_user_id = ${userId}
    `;

    if (existing.length > 0) {
      return Response.json({ business: existing[0] });
    }

    // Try to insert, handle duplicate email gracefully
    try {
      const business = await sql`
        INSERT INTO businesses (name, email, clerk_user_id, subscription_status, trial_ends_at)
        VALUES (${name}, ${email}, ${userId}, 'trial', NOW() + INTERVAL '14 days')
        RETURNING *
      `;
      return Response.json({ business: business[0] });
    } catch (insertError) {
      // If duplicate email, fetch by email instead
      if (insertError.code === '23505') {
        const byEmail = await sql`
          SELECT * FROM businesses WHERE email = ${email}
        `;
        if (byEmail.length > 0) {
          return Response.json({ business: byEmail[0] });
        }
      }
      throw insertError;
    }
  } catch (error) {
    console.error("Register business error:", error);
    return Response.json({ error: "Failed to register business" }, { status: 500 });
  }
}