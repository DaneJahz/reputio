import sql from "@/lib/db";
import { sendWaitlistEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { email, businessName } = await request.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if already on waitlist
    const existing = await sql`
      SELECT * FROM waitlist WHERE email = ${email}
    `;

    if (existing.length > 0) {
      return Response.json({ success: true, alreadyJoined: true });
    }

    await sql`
      INSERT INTO waitlist (email, business_name)
      VALUES (${email}, ${businessName || null})
    `;

    // Send confirmation email
    try {
      await sendWaitlistEmail({ email, businessName });
    } catch (emailError) {
      console.error("Waitlist email error:", emailError);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Waitlist error:", error);
    return Response.json({ error: "Failed to join waitlist" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const entries = await sql`
      SELECT * FROM waitlist ORDER BY created_at DESC
    `;
    return Response.json({ entries });
  } catch (error) {
    return Response.json({ error: "Failed to fetch waitlist" }, { status: 500 });
  }
}