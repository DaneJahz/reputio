import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import sql from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const businesses = await sql`
      SELECT * FROM businesses WHERE clerk_user_id = ${userId}
    `;

    if (!businesses.length || !businesses[0].stripe_subscription_id) {
      return Response.json({ error: "No subscription found" }, { status: 400 });
    }

    const subscription = await stripe.subscriptions.retrieve(
      businesses[0].stripe_subscription_id
    );

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.customer,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Portal error:", error);
    return Response.json({ error: "Failed to create portal session" }, { status: 500 });
  }
}