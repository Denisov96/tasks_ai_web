export const dynamic = "force-dynamic";
import { prisma } from "../../../prisma/db";
import { headers } from "next/headers";
import { getTasks } from "../../../lib/db";
import { validateUserId } from "../../../lib/requests";

export async function GET() {
  try {
    const headersList = headers();
    const userId = parseInt(headersList.get(`userId`));

    const errorResponse = validateUserId(userId);
    if (errorResponse) return errorResponse;

    const tasks = await getTasks(userId);
    return Response.json({ data: tasks });
  } catch (error) {
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const headersList = headers();
    const userId = parseInt(headersList.get(`userId`));

    const errorResponse = validateUserId(userId);

    if (errorResponse) return errorResponse;

    const { text } = await request.json();
    if (!text?.trim()) {
      return Response.json({ error: "Text is required" }, { status: 400 });
    }

    await prisma.task.create({
      data: { text: text.trim(), userId },
    });

    return Response.json({ data: await getTasks(userId) });
  } catch (error) {
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
