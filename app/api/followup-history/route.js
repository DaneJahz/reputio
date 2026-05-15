import { auth } from "@clerk/nextjs/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const history = await sql`
      SELECT * FROM followup_history
      WHERE clerk_user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 50
    `;

    return Response.json({ history });
  } catch (error) {
    console.error("History fetch error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, customerName, jobType, estimateAmount, daysSince, tone, messages } = await request.json();

    await sql`
      INSERT INTO followup_history (
        clerk_user_id, type, customer_name, job_type,
        estimate_amount, days_since, tone,
        email_subject, email_body, text_message, voicemail
      ) VALUES (
        ${userId}, ${type}, ${customerName}, ${jobType},
        ${estimateAmount || null}, ${daysSince || null}, ${tone},
        ${messages.email?.subject || null}, ${messages.email?.body || null},
        ${messages.text || null}, ${messages.voicemail || null}
      )
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("History save error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}