import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const sql = neon(process.env.DATABASE_URL);

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature error:", error);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "customer.subscription.created") {
      const subscription = event.data.object;
      const userId = subscription.metadata.userId;

      if (userId) {
        await sql`
          UPDATE businesses 
          SET subscription_status = 'active', 
              stripe_subscription_id = ${subscription.id}
          WHERE clerk_user_id = ${userId}
        `;
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const userId = subscription.metadata.userId;

      if (userId) {
        // Get the business first
        const businesses = await sql`
          SELECT * FROM businesses WHERE clerk_user_id = ${userId}
        `;

        if (businesses.length) {
          const business = businesses[0];

          // Delete response drafts first (they reference reviews)
          await sql`
            DELETE FROM response_drafts
            WHERE review_id IN (
              SELECT id FROM reviews WHERE business_id = ${business.id}
            )
          `;

          // Delete reviews
          await sql`
            DELETE FROM reviews WHERE business_id = ${business.id}
          `;

          // Revoke Google token if present
          if (business.google_access_token) {
            try {
              await fetch(
                `https://oauth2.googleapis.com/revoke?token=${business.google_access_token}`,
                { method: "POST" }
              );
            } catch (err) {
              console.error("Google token revoke error:", err);
            }
          }

          // Clear sensitive data and mark as inactive
          await sql`
            UPDATE businesses 
            SET subscription_status = 'inactive',
                stripe_subscription_id = NULL,
                google_access_token = NULL,
                google_refresh_token = NULL,
                google_token_expiry = NULL,
                google_location_id = NULL
            WHERE clerk_user_id = ${userId}
          `;

          console.log(`Data cleared for cancelled user: ${userId}`);
        }
      }
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      const userId = subscription.metadata.userId;

      if (userId) {
        const status = subscription.status === "active" ? "active" : "inactive";
        await sql`
          UPDATE businesses 
          SET subscription_status = ${status}
          WHERE clerk_user_id = ${userId}
        `;
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ error: "Webhook failed" }, { status: 500 });
  }
}