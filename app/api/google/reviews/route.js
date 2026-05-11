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
    console.log("Accounts response:", JSON.stringify(accountsData));

    if (!accountsData.accounts?.length) {
      return Response.json({ error: "No Google Business accounts found", debug: accountsData }, { status: 404 });
    }

    const accountId = accountsData.accounts[0].name;
    console.log("Account ID:", accountId);

    const locationsRes = await fetch(
      `https://mybusinessbusinessinformation.googleapis.com/v1/${accountId}/locations`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const locationsData = await locationsRes.json();
    console.log("Locations response:", JSON.stringify(locationsData));

    if (!locationsData.locations?.length) {
      return Response.json({ error: "No locations found", debug: locationsData }, { status: 404 });
    }

    const locationId = locationsData.locations[0].name;
    console.log("Location ID:", locationId);

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
    console.log("Reviews response:", JSON.stringify(reviewsData));

    return Response.json({ reviews: reviewsData.reviews || [], locationId });
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return Response.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}