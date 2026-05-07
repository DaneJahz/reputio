import sql from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const businesses = await sql`
      SELECT * FROM businesses
      WHERE subscription_status IN ('active', 'trial')
      AND email IS NOT NULL
    `;

    console.log(`Found ${businesses.length} businesses`);
    console.log(`RESEND_API_KEY starts with: ${process.env.RESEND_API_KEY?.substring(0, 8)}`);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let sent = 0;

    for (const business of businesses) {
      try {
        console.log(`Sending to: ${business.email}`);

        const result = await resend.emails.send({
          from: "OwnerReply <noreply@getownerreply.com>",
          to: business.email,
          subject: "Weekly digest test",
          html: "<p>Test email from OwnerReply digest</p>",
        });

        console.log(`Resend result:`, JSON.stringify(result));
        sent++;
      } catch (err) {
        console.error(`Error for ${business.email}:`, err.message);
      }
    }

    return Response.json({ success: true, sent });
  } catch (error) {
    console.error("Weekly digest error:", error);
    return Response.json({ error: "Failed to send digests" }, { status: 500 });
  }
}