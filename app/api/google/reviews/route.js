import { auth } from "@clerk/nextjs/server";
import sql from "@/lib/db";
import { getValidAccessToken } from "@/lib/google";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const businesses = await sql`
      SELECT * FROM businesses WHERE clerk_user_id = ${userId}
    `;

    if (!businesses.length || !businesses[0].google_access_token) {
      return Response.json({ error: "Google not connected" }, { status: 400 });
    }

    const business = businesses[0];

    // Get valid access token (refreshes if expired)
    let accessToken;
    try {
      accessToken = await getValidAccessToken(business);
    } catch (err) {
      console.error("Token refresh error:", err);
      return Response.json({ error: "Google token expired. Please reconnect." }, { status: 401 });
    }

    const accountsRes = await fetch(
      "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const accountsData = await accountsRes.json();

    if (!accountsData.accounts?.length) {
      return Response.json({ error: "No Google Business accounts found" }, { status: 404 });
    }

    const accountId = accountsData.accounts[0].name;

    const locationsRes = await fetch(
      `https://mybusinessbusinessinformation.googleapis.com/v1/${accountId}/locations`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const locationsData = await locationsRes.json();

    if (!locationsData.locations?.length) {
      return Response.json({ error: "No locations found" }, { status: 404 });
    }

    const locationId = locationsData.locations[0].name;

    // Save location ID to database if not already saved
    if (!business.google_location_id) {
      await sql`
        UPDATE businesses
        SET google_location_id = ${locationId}
        WHERE clerk_user_id = ${userId}
      `;
    }

    const reviewsRes = await fetch(
      `https://mybusiness.googleapis.com/v4/${locationId}/reviews`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const reviewsData = await reviewsRes.json();

    return Response.json({ reviews: reviewsData.reviews || [], locationId });
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return Response.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}