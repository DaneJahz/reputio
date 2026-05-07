import { auth } from "@clerk/nextjs/server";
import { generateReviewResponse } from "@/lib/ai";
import sql from "@/lib/db";

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { review, tone } = await request.json();

    if (!review) {
      return Response.json({ error: "Review is required" }, { status: 400 });
    }

    const businesses = await sql`
      SELECT * FROM businesses WHERE clerk_user_id = ${userId}
    `;

    const businessName = businesses[0]?.business_name || "";

    const response = await generateReviewResponse(review, businessName, tone || "professional");

    return Response.json({ response });
  } catch (error) {
    console.error("Error generating response:", error);
    return Response.json({ error: "Failed to generate response" }, { status: 500 });
  }
}