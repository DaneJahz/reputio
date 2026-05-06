import { auth } from "@clerk/nextjs/server";
import { generateReviewResponse } from "@/lib/ai";

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { review } = await request.json();

    if (!review) {
      return Response.json({ error: "Review is required" }, { status: 400 });
    }

    const response = await generateReviewResponse(review);

    return Response.json({ response });
  } catch (error) {
    console.error("Error generating response:", error);
    return Response.json({ error: "Failed to generate response" }, { status: 500 });
  }
}