import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendApprovalEmail({
  businessEmail,
  businessName,
  reviewerName,
  rating,
  reviewText,
  draftResponse,
  responseId,
}) {
  const approveUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/approve-response?id=${responseId}&action=approve`;
  const editUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

  await resend.emails.send({
    from: "OwnerReply <noreply@getownerreply.com>",
    to: businessEmail,
    subject: `New ${rating}★ review from ${reviewerName} — approve your response`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #111;">New review needs a response</h2>
        <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 8px;"><strong>${reviewerName}</strong> — ${"★".repeat(rating)}${"☆".repeat(5 - rating)}</p>
          <p style="margin: 0; color: #444;">"${reviewText}"</p>
        </div>
        <h3 style="color: #111;">AI drafted response:</h3>
        <div style="background: #f0f7ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 16px 0; border-radius: 4px;">
          <p style="margin: 0; color: #111;">${draftResponse}</p>
        </div>
        <div style="margin: 24px 0;">
          <a href="${approveUrl}" style="background: #111; color: white; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-size: 14px; margin-right: 12px;">
            ✓ Approve & Post
          </a>
          <a href="${editUrl}" style="border: 1px solid #ddd; color: #111; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-size: 14px;">
            Edit Response
          </a>
        </div>
        <p style="color: #999; font-size: 12px;">Powered by OwnerReply — AI review responses for small businesses</p>
      </div>
    `,
  });
}

export async function sendReviewNotification({
  to,
  businessName,
  reviewerName,
  rating,
  reviewText,
  draftResponse,
}) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

  await resend.emails.send({
    from: "OwnerReply <noreply@getownerreply.com>",
    to: to,
    subject: `New ${rating}★ review from ${reviewerName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #111;">You got a new review${businessName ? ` for ${businessName}` : ""}!</h2>
        <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 8px;"><strong>${reviewerName}</strong> — ${"★".repeat(rating)}${"☆".repeat(5 - rating)}</p>
          <p style="margin: 0; color: #444;">"${reviewText}"</p>
        </div>
        <h3 style="color: #111;">AI drafted response:</h3>
        <div style="background: #f0f7ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 16px 0; border-radius: 4px;">
          <p style="margin: 0; color: #111;">${draftResponse}</p>
        </div>
        <div style="margin: 24px 0;">
          <a href="${dashboardUrl}" style="background: #111; color: white; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-size: 14px;">
            Review & Post Response
          </a>
        </div>
        <p style="color: #999; font-size: 12px;">Powered by OwnerReply — AI review responses for small businesses</p>
      </div>
    `,
  });
}

export async function sendWeeklyDigest({
  businessEmail,
  businessName,
  newReviews,
  unansweredCount,
  averageRating,
}) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

  const reviewRows = newReviews.length > 0
    ? newReviews.map(r => `
        <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin: 12px 0;">
          <p style="margin: 0 0 8px;"><strong>${r.reviewer_name || "Anonymous"}</strong> — ${"★".repeat(r.rating || 0)}${"☆".repeat(5 - (r.rating || 0))}</p>
          <p style="margin: 0; color: #444;">${r.review_text || "No comment left."}</p>
        </div>
      `).join("")
    : `<p style="color: #999;">No new reviews this week.</p>`;

  await resend.emails.send({
    from: "OwnerReply <noreply@getownerreply.com>",
    to: businessEmail,
    subject: `Your weekly review summary${businessName ? ` for ${businessName}` : ""}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #111;">Your weekly review summary</h2>
        ${businessName ? `<p style="color: #666; margin-top: -8px;">${businessName}</p>` : ""}
        
        <div style="display: flex; gap: 16px; margin: 24px 0;">
          <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; flex: 1; text-align: center;">
            <p style="margin: 0; font-size: 28px; font-weight: bold; color: #111;">${newReviews.length}</p>
            <p style="margin: 4px 0 0; color: #666; font-size: 13px;">New reviews</p>
          </div>
          <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; flex: 1; text-align: center;">
            <p style="margin: 0; font-size: 28px; font-weight: bold; color: #111;">${averageRating > 0 ? averageRating.toFixed(1) : "—"}</p>
            <p style="margin: 4px 0 0; color: #666; font-size: 13px;">Average rating</p>
          </div>
          <div style="background: #fff3cd; border-radius: 8px; padding: 16px; flex: 1; text-align: center;">
            <p style="margin: 0; font-size: 28px; font-weight: bold; color: #856404;">${unansweredCount}</p>
            <p style="margin: 4px 0 0; color: #856404; font-size: 13px;">Unanswered</p>
          </div>
        </div>

        <h3 style="color: #111;">New reviews this week:</h3>
        ${reviewRows}

        <div style="margin: 24px 0;">
          <a href="${dashboardUrl}" style="background: #111; color: white; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-size: 14px;">
            Go to Dashboard
          </a>
        </div>
        <p style="color: #999; font-size: 12px;">Powered by OwnerReply — AI review responses for small businesses</p>
      </div>
    `,
  });
}
export async function sendWelcomeEmail({ businessEmail, businessName }) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
  const settingsUrl = `${process.env.NEXT_PUBLIC_APP_URL}/settings`;
  const connectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/google/connect`;

  await resend.emails.send({
    from: "Bert at OwnerReply <noreply@getownerreply.com>",
    to: businessEmail,
    subject: "Welcome to OwnerReply — here's how to get started",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #111;">Welcome to OwnerReply${businessName ? `, ${businessName}` : ""}!</h2>
        <p style="color: #444; line-height: 1.6;">I'm Bert — I built OwnerReply specifically for small business owners who care about their Google reviews but don't have hours to spend managing them.</p>
        <p style="color: #444; line-height: 1.6;">You're now on your <strong>14-day free trial</strong>. Here's how to get up and running in the next 5 minutes:</p>
        
        <div style="margin: 24px 0;">
          <div style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 20px;">
            <div style="background: #111; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold; flex-shrink: 0; text-align: center; line-height: 28px;">1</div>
            <div>
              <p style="margin: 0 0 4px; font-weight: 600; color: #111;">Enter your business name</p>
              <p style="margin: 0; color: #666; font-size: 14px;">Go to Settings and add your business name so AI responses are personalized to your brand.</p>
              <a href="${settingsUrl}" style="color: #3b82f6; font-size: 14px; text-decoration: none;">Go to Settings →</a>
            </div>
          </div>
          
          <div style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 20px;">
            <div style="background: #111; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold; flex-shrink: 0; text-align: center; line-height: 28px;">2</div>
            <div>
              <p style="margin: 0 0 4px; font-weight: 600; color: #111;">Connect your Google Business Profile</p>
              <p style="margin: 0; color: #666; font-size: 14px;">This takes 30 seconds and lets OwnerReply pull in your reviews and post responses directly to Google.</p>
              <a href="${connectUrl}" style="color: #3b82f6; font-size: 14px; text-decoration: none;">Connect Google →</a>
            </div>
          </div>

          <div style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 20px;">
            <div style="background: #111; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold; flex-shrink: 0; text-align: center; line-height: 28px;">3</div>
            <div>
              <p style="margin: 0 0 4px; font-weight: 600; color: #111;">Generate your first response</p>
              <p style="margin: 0; color: #666; font-size: 14px;">Once connected, your reviews will appear in your dashboard. Click "Generate AI Response" on any review and approve it with one click.</p>
              <a href="${dashboardUrl}" style="color: #3b82f6; font-size: 14px; text-decoration: none;">Go to Dashboard →</a>
            </div>
          </div>
        </div>

        <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0 0 8px; font-weight: 600; color: #111;">Your 14-day free trial includes:</p>
          <p style="margin: 4px 0; color: #444; font-size: 14px;">✓ Unlimited AI-drafted Google review responses</p>
          <p style="margin: 4px 0; color: #444; font-size: 14px;">✓ One-click approve and post to Google</p>
          <p style="margin: 4px 0; color: #444; font-size: 14px;">✓ Review analytics dashboard</p>
          <p style="margin: 4px 0; color: #444; font-size: 14px;">✓ Instant email alerts for new reviews</p>
          <p style="margin: 4px 0; color: #444; font-size: 14px;">✓ Weekly review digest email</p>
        </div>

        <div style="margin: 24px 0;">
          <a href="${dashboardUrl}" style="background: #111; color: white; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-size: 14px;">
            Get Started →
          </a>
        </div>

        <p style="color: #444; font-size: 14px; line-height: 1.6;">If you have any questions at all, just reply to this email. I read every message personally.</p>
        <p style="color: #444; font-size: 14px;">— Bert Hagen<br>Founder, OwnerReply<br>Jacksonville, FL</p>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">OwnerReply · getownerreply.com</p>
      </div>
    `,
  });
}
export async function sendCancellationEmail({
  businessEmail,
  businessName,
  reason,
}) {
  await resend.emails.send({
    from: "OwnerReply <noreply@getownerreply.com>",
    to: "getownerreply@gmail.com",
    subject: `Cancellation reason — ${businessName || businessEmail}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #111;">Cancellation Feedback</h2>
        <p style="color: #444;"><strong>Business:</strong> ${businessName || "Unknown"}</p>
        <p style="color: #444;"><strong>Email:</strong> ${businessEmail}</p>
        <p style="color: #444;"><strong>Reason:</strong> ${reason}</p>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">Sent automatically by OwnerReply cancel flow.</p>
      </div>
    `,
  });
}