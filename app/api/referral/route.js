import { auth } from "@clerk/nextjs/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const businesses = await sql`
      SELECT referral_code, referral_count FROM businesses 
      WHERE clerk_user_id = ${userId}
    `;

    if (!businesses.length) return Response.json({ error: "Business not found" }, { status: 404 });

    return Response.json({ 
      referralCode: businesses[0].referral_code,
      referralCount: businesses[0].referral_count || 0
    });
  } catch (error) {
    console.error("Referral fetch error:", error);
    return Response.json({ error: "Failed to fetch referral" }, { status: 500 });
  }
}