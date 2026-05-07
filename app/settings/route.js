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

    return Response.json({ business: businesses[0] || null });
  } catch (error) {
    console.error("Settings fetch error:", error);
    return Response.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessName, tone } = await request.json();

    await sql`
      UPDATE businesses
      SET business_name = ${businessName},
          tone = ${tone}
      WHERE clerk_user_id = ${userId}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Settings save error:", error);
    return Response.json({ error: "Failed to save settings" }, { status: 500 });
  }
}