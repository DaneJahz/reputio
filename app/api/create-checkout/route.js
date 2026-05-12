import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  followup: "price_1TWHtHHFqyygHRq0QCMyWIVU",
  reviews: "price_1TVchRHFqyygHRq0NfmSHRuc",
  both: "price_1TWHwFHFqyygHRq0loxUOQDU",
};

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const plan = body.plan || "reviews";
    const priceId = PRICE_IDS[plan] || PRICE_IDS.reviews;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      metadata: { userId, plan },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return Response.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}