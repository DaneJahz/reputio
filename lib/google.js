import sql from "@/lib/db";

export async function refreshGoogleToken(business) {
  if (!business.google_refresh_token) {
    throw new Error("No refresh token available");
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: business.google_refresh_token,
      grant_type: "refresh_token",
    }),
  });

  const tokens = await tokenResponse.json();

  if (!tokens.access_token) {
    throw new Error("Failed to refresh token");
  }

  await sql`
    UPDATE businesses
    SET google_access_token = ${tokens.access_token},
        google_token_expiry = ${new Date(Date.now() + tokens.expires_in * 1000).toISOString()}
    WHERE id = ${business.id}
  `;

  return tokens.access_token;
}

export async function getValidAccessToken(business) {
  const expiryTime = business.google_token_expiry
    ? new Date(business.google_token_expiry)
    : null;
  const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);

  if (!expiryTime || expiryTime < fiveMinutesFromNow) {
    return await refreshGoogleToken(business);
  }

  return business.google_access_token;
}