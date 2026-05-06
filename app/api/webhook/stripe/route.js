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
        await sql`
          UPDATE businesses 
          SET subscription_status = 'inactive'
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