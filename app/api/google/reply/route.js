import { auth } from "@clerk/nextjs/server";
import sql from "@/lib/db";

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reviewName, replyText } = await request.json();

    const businesses = await sql`
      SELECT * FROM businesses WHERE clerk_user_id = ${userId}
    `;

    if (!businesses.length || !businesses[0].google_access_token) {
      return Response.json({ error: "Google not connected" }, { status: 400 });
    }

    const business = businesses[0];

    const res = await fetch(
      `https://mybusiness.googleapis.com/v4/${reviewName}/reply`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${business.google_access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: replyText }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Google reply error:", data);
      return Response.json({ error: "Failed to post reply" }, { status: 500 });
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("Reply error:", error);
    return Response.json({ error: "Failed to post reply" }, { status: 500 });
  }
}