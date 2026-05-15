import { auth } from "@clerk/nextjs/server";
import { generateFollowUpMessages } from "@/lib/ai";
import sql from "@/lib/db";

const adminUserIds = [
  'user_3DN04mExtQRhazlDsqU3nzFMWoo',
  'user_3DN0r63rLgdtSK8NNtE823dKDXU',
];

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, data } = await request.json();
    if (!type || !data) {
      return Response.json({ error: "Type and data are required" }, { status: 400 });
    }

    const isAdmin = adminUserIds.includes(userId);
    const isProduction = process.env.NODE_ENV === "production";

    if (!isAdmin && isProduction) {
      const businesses = await sql`
        SELECT * FROM businesses WHERE clerk_user_id = ${userId}
      `;
      if (!businesses.length) {
        return Response.json({ error: "Business not found" }, { status: 400 });
      }

      const business = businesses[0];
      const isActive = business.subscription_status === "active";
      const isTrial = business.subscription_status === "trial";
      const trialExpired = isTrial && business.trial_ends_at && new Date(business.trial_ends_at) < new Date();

      if (!isActive && (!isTrial || trialExpired)) {
        return Response.json({ error: "subscription_required" }, { status: 403 });
      }

      if (isActive && business.plan === "reviews") {
        return Response.json({ error: "plan_upgrade_required" }, { status: 403 });
      }
    }

    const messages = await generateFollowUpMessages(type, data);

// Save to history
try {
  await sql`
    INSERT INTO followup_history (
      clerk_user_id, type, customer_name, job_type,
      estimate_amount, days_since, tone,
      email_subject, email_body, text_message, voicemail
    ) VALUES (
      ${userId}, ${type}, ${data.customerName || data.customerName}, 
      ${data.jobType || data.lastJobType},
      ${data.estimateAmount || null}, ${data.daysSince || null}, ${data.tone},
      ${messages.email?.subject || null}, ${messages.email?.body || null},
      ${messages.text || null}, ${messages.voicemail || null}
    )
  `;
} catch (err) {
  console.error("History save error (non-fatal):", err);
}

return Response.json({ messages });
  } catch (error) {
    console.error("Error generating follow-up:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}