import { prisma } from "../../../prisma/db";
import { getUserIdFromCookies } from "../../../lib/auth";
import { validateUserId } from "../../../lib/requests";
import { getTasks } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userId = getUserIdFromCookies();
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
    const userId = getUserIdFromCookies();
    const errorResponse = validateUserId(userId);
    if (errorResponse) return errorResponse;

    const { text } = await request.json();
    if (!text?.trim()) {
      return Response.json({ error: "Text is required" }, { status: 400 });
    }

    await prisma.task.create({
      data: { text: text.trim(), userId },
    });

    const tasks = await getTasks(userId);
    return Response.json({ data: tasks });
  } catch (error) {
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
