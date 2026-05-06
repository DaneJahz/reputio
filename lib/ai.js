import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateReviewResponse(review) {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a professional business owner responding to a Google review. Write a polite, professional, and personalized response to the following review. Keep it concise (2-4 sentences). Do not use generic phrases like "We appreciate your feedback". Make it feel genuine and human.

Business review:
Reviewer: ${review.reviewer_name}
Rating: ${review.rating} out of 5 stars
Review: ${review.review_text}

Write only the response, nothing else.`,
      },
    ],
  });

  return message.content[0].text;
}