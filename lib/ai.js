import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateReviewResponse(review, businessName = "", tone = "professional") {
  const toneInstructions = {
    professional: "Write in a polished, professional tone. Be courteous and formal.",
    friendly: "Write in a warm, friendly and conversational tone. Be approachable and personable.",
    apologetic: "Write in an empathetic and apologetic tone. Acknowledge any concerns sincerely and focus on making things right.",
  };

  const businessContext = businessName ? `You are the owner of ${businessName}.` : "You are a professional business owner.";
  const toneGuide = toneInstructions[tone] || toneInstructions.professional;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `${businessContext} Write a response to the following Google review. ${toneGuide} Keep it concise (2-4 sentences). Do not use generic phrases like "We appreciate your feedback". Make it feel genuine and human. ${businessName ? `Reference the business name "${businessName}" naturally if appropriate.` : ""}

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