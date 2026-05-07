import sql from "@/lib/db";
import { generateReviewResponse } from "@/lib/ai";
import { sendReviewNotification } from "@/lib/email";

export async function GET(request) {
  try {
    // Verify this is called from Railway cron
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all businesses with Google connected
    const businesses = await sql`
      SELECT * FROM businesses 
      WHERE google_access_token IS NOT NULL
      AND subscription_status IN ('trial', 'active')
    `;

    let totalNewReviews = 0;

    for (const business of businesses) {
      try {
        // Fetch reviews from Google
        const accountsRes = await fetch(
          "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
          { headers: { Authorization: `Bearer ${business.google_access_token}` } }
        );
        const accountsData = await accountsRes.json();
        if (!accountsData.accounts?.length) continue;

        const accountId = accountsData.accounts[0].name;
        const locationsRes = await fetch(
          `https://mybusinessbusinessinformation.googleapis.com/v1/${accountId}/locations`,
          { headers: { Authorization: `Bearer ${business.google_access_token}` } }
        );
        const locationsData = await locationsRes.json();
        if (!locationsData.locations?.length) continue;

        const locationId = locationsData.locations[0].name;
        const reviewsRes = await fetch(
          `https://mybusiness.googleapis.com/v4/${locationId}/reviews`,
          { headers: { Authorization: `Bearer ${business.google_access_token}` } }
        );
        const reviewsData = await reviewsRes.json();
        if (!reviewsData.reviews?.length) continue;

        // Check each review
        for (const review of reviewsData.reviews) {
          // Skip if already in database
          const existing = await sql`
            SELECT id FROM reviews WHERE google_review_id = ${review.reviewId}
          `;
          if (existing.length > 0) continue;

          // New review found — save it
          await sql`
            INSERT INTO reviews (business_id, google_review_id, reviewer_name, rating, review_text, review_date, status)
            VALUES (
              ${business.id},
              ${review.reviewId},
              ${review.reviewer?.displayName || "Anonymous"},
              ${["ONE","TWO","THREE","FOUR","FIVE"].indexOf(review.starRating) + 1},
              ${review.comment || ""},
              ${new Date(review.createTime).toISOString()},
              'pending'
            )
          `;

          // Generate AI draft
          const draft = await generateReviewResponse(
            {
              reviewer_name: review.reviewer?.displayName || "Anonymous",
              rating: ["ONE","TWO","THREE","FOUR","FIVE"].indexOf(review.starRating) + 1,
              review_text: review.comment || "No comment left",
            },
            business.business_name || "",
            business.tone || "professional"
          );

          // Send email notification to owner
          await sendReviewNotification({
            to: business.email,
            businessName: business.business_name || business.name,
            reviewerName: review.reviewer?.displayName || "Anonymous",
            rating: ["ONE","TWO","THREE","FOUR","FIVE"].indexOf(review.starRating) + 1,
            reviewText: review.comment || "No comment left",
            draftResponse: draft,
          });

          totalNewReviews++;
        }
      } catch (err) {
        console.error(`Error processing business ${business.id}:`, err);
      }
    }

    return Response.json({ success: true, newReviews: totalNewReviews });
  } catch (error) {
    console.error("Cron error:", error);
    return Response.json({ error: "Cron failed" }, { status: 500 });
  }
}