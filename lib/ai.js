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

export async function generateFollowUpMessages(type, data) {
  if (type === "estimate") {
    const { customerName, jobType, estimateAmount, daysSince, tone,
            callWentHow, customerSaid, concerns, extraContext } = data;

    const toneGuide = {
      friendly: "warm and conversational, like texting a neighbour — never pushy",
      professional: "polished and professional, respectful of their time",
      urgent: "confident and clear, conveying mild urgency without pressure",
    }[tone] || "friendly";

    const callContext = {
      great: "The initial conversation went great — they seemed very interested.",
      good: "The initial conversation went well with no red flags.",
      hesitant: "The customer had some hesitation during the initial conversation.",
      concerned: "The customer raised specific concerns during the initial conversation.",
      nospoke: "The estimate was sent cold — there has been no conversation yet.",
    }[callWentHow] || "";

    const contextLines = [
      callContext,
      customerSaid ? `What the customer said: "${customerSaid}"` : "",
      concerns ? `Concerns they mentioned: "${concerns}"` : "",
      extraContext ? `Additional context: ${extraContext}` : "",
    ].filter(Boolean).join("\n");

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: `You are a local contractor following up on an estimate sent ${daysSince} days ago.
Customer: ${customerName}
Job type: ${jobType}
Estimate amount: $${estimateAmount}
Tone: ${toneGuide}
${contextLines ? `\nCustomer context:\n${contextLines}` : ""}

Use the customer context to make the messages feel personal and relevant — not generic. If they had concerns, address them naturally. If they said something specific, weave it in.

Return ONLY this JSON, no markdown, no extra text:
{
  "email": { "subject": "...", "body": "..." },
  "text": "...",
  "voicemail": "..."
}

Rules:
- Email body: 3-4 sentences, soft call to action, sign off naturally
- Text: under 160 characters, punchy and direct
- Voicemail: sounds like a real person, 20 seconds when read aloud
- Use the customer name and job type naturally
- Never sound desperate or robotic`,
      }],
    });
    const raw = message.content[0].text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    return JSON.parse(raw);
  }

  if (type === "winback") {
    const { customerName, lastJobType, timeAgo, reason, tone,
            jobWentHow, memorableDetails, whyNeedYou, extraContext } = data;

    const toneGuide = {
      friendly: "warm and conversational, like reconnecting with someone you know",
      professional: "polished and professional",
      casual: "relaxed and low-key, just a quick check-in",
    }[tone] || "friendly";

    const reasonText = {
      maintenance: "seasonal maintenance reminder",
      checkup: "annual checkup or inspection",
      newservice: "a new service you now offer",
      checkin: "general check-in to see if they need anything",
    }[reason] || "checking in";

    const jobContext = {
      great: "The last job went great — they were very happy with the work.",
      good: "The last job went smoothly with no issues.",
      minorissue: "There was a minor issue on the last job that was resolved.",
      complicated: "The last job was complicated.",
    }[jobWentHow] || "";

    const contextLines = [
      jobContext,
      memorableDetails ? `Memorable details about this customer: "${memorableDetails}"` : "",
      whyNeedYou ? `Why they might need service again: "${whyNeedYou}"` : "",
      extraContext ? `Additional context: ${extraContext}` : "",
    ].filter(Boolean).join("\n");

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: `You are a local contractor reaching out to a past customer you haven't heard from in ${timeAgo}.
Customer: ${customerName}
Last job done: ${lastJobType}
Reason for outreach: ${reasonText}
Tone: ${toneGuide}
${contextLines ? `\nCustomer context:\n${contextLines}` : ""}

Use the customer context to make the messages feel like they come from someone who actually remembers this customer — not a mass email blast. Reference specific details naturally where appropriate.

Return ONLY this JSON, no markdown, no extra text:
{
  "email": { "subject": "...", "body": "..." },
  "text": "...",
  "voicemail": "..."
}

Rules:
- Reference the last job naturally
- Make it feel timely and relevant, not like a mass email
- Email: 3-4 sentences with a soft call to action
- Text: under 160 characters
- Voicemail: 20 seconds when read aloud, natural speech`,
      }],
    });
    const raw = message.content[0].text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    return JSON.parse(raw);
  }
}