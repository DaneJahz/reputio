import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const userId = searchParams.get("state");

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

    if (!tokens.access_token) {
      return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=no_token`);
    }

    await sql`
      UPDATE businesses
      SET google_access_token = ${tokens.access_token},
          google_refresh_token = ${tokens.refresh_token || null},
          google_token_expiry = ${new Date(Date.now() + tokens.expires_in * 1000).toISOString()}
      WHERE clerk_user_id = ${userId}
    `;

    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?google=connected`);
  } catch (error) {
    console.error("Google callback error:", error);
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=callback_failed`);
  }
}