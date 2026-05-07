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