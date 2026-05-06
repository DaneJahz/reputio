import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const action = searchParams.get("action");

    if (!id || !action) {
      return new Response("Missing parameters", { status: 400 });
    }

    if (action === "approve") {
      await sql`
        UPDATE response_drafts 
        SET status = 'approved', approved_at = NOW()
        WHERE id = ${id}
      `;

      return new Response(`
        <html>
          <body style="font-family: sans-serif; max-width: 500px; margin: 80px auto; text-align: center; padding: 24px;">
            <div style="font-size: 48px; margin-bottom: 16px;">✓</div>
            <h2 style="color: #111;">Response approved!</h2>
            <p style="color: #666;">Your response has been approved and will be posted to Google shortly.</p>
            <a href="https://getownerreply.com/dashboard" style="display: inline-block; margin-top: 24px; background: #111; color: white; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-size: 14px;">
              Back to Dashboard
            </a>
          </body>
        </html>
      `, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Invalid action", { status: 400 });
  } catch (error) {
    console.error("Approve error:", error);
    return new Response("Error processing approval", { status: 500 });
  }
}