import { auth } from "@clerk/nextjs/server";
import sql from "@/lib/db";
import { sendCancellationEmail } from "@/lib/email";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { reason, acceptDiscount } = await request.json();

    const businesses = await sql`
      SELECT * FROM businesses WHERE clerk_user_id = ${userId}
    `;

    if (!businesses.length) return Response.json({ error: "Business not found" }, { status: 404 });

    const business = businesses[0];

    // Send cancellation reason email
    try {
      await sendCancellationEmail({
        businessEmail: business.email,
        businessName: business.business_name || business.name,
        reason,
      });
    } catch (emailError) {
      console.error("Cancellation email error:", emailError);
    }

    // Handle discount offer
    if (acceptDiscount && !business.discount_offered && business.stripe_subscription_id) {
      try {
        await stripe.subscriptions.update(business.stripe_subscription_id, {
          coupon: "CvoKW0vj",
        });

        await sql`
          UPDATE businesses 
          SET discount_offered = true 
          WHERE clerk_user_id = ${userId}
        `;

        return Response.json({ success: true, discountApplied: true });
      } catch (stripeError) {
        console.error("Stripe discount error:", stripeError);
        return Response.json({ error: "Failed to apply discount" }, { status: 500 });
      }
    }

    return Response.json({ success: true, discountApplied: false });
  } catch (error) {
    console.error("Cancel flow error:", error);
    return Response.json({ error: "Failed to process" }, { status: 500 });
  }
}