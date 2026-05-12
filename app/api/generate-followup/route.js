import { auth } from "@clerk/nextjs/server";
import { generateFollowUpMessages } from "@/lib/ai";

const adminUserIds = [
  'user_3DN04mExtQRhazlDsqU3nzFMWoo',
  'user_3DN0r63rLgdtSK8NNtE823dKDXU',
];

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, data } = await request.json();
    if (!type || !data) {
      return Response.json({ error: "Type and data are required" }, { status: 400 });
    }

    const messages = await generateFollowUpMessages(type, data);
    return Response.json({ messages });
  } catch (error) {
    console.error("Error generating follow-up:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}