import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const userId = searchParams.get("state");

  console.log("Google callback - code:", code ? "present" : "missing");
  console.log("Google callback - userId from state:", userId);
  console.log("Client ID first 10:", process.env.GOOGLE_CLIENT_ID?.substring(0, 10));
  console.log("Client Secret first 10:", process.env.GOOGLE_CLIENT_SECRET?.substring(0, 10));
  console.log("Redirect URI:", `${process.env.NEXT_PUBLIC_APP_URL}/api/google/callback`);

  if (!code || !userId) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=google_auth_failed`);
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenResponse.json();
    console.log("Token response:", JSON.stringify(tokens));

    if (!tokens.access_token) {
      return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=no_token`);
    }

    const result = await sql`
      UPDATE businesses
      SET google_access_token = ${tokens.access_token},
          google_refresh_token = ${tokens.refresh_token || null},
          google_token_expiry = ${new Date(Date.now() + tokens.expires_in * 1000).toISOString()}
      WHERE clerk_user_id = ${userId}
      RETURNING id, clerk_user_id, email
    `;

    console.log("Update result:", JSON.stringify(result));

    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?google=connected`);
  } catch (error) {
    console.error("Google callback error:", error);
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=callback_failed`);
  }
}