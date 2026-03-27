import { prisma } from "../../../prisma/db";
import { getUserIdFromCookies } from "../../../lib/auth";
import { validateUserId } from "../../../lib/requests";
import { getTasks } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const userId = getUserIdFromCookies(request); 
    const errorResponse = validateUserId(userId);
    if (errorResponse) return errorResponse;

    const tasks = await getTasks(userId);
    return Response.json({ data: tasks });
  } catch (error) {
    console.error("GET error:", error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = getUserIdFromCookies(request); 
    const errorResponse = validateUserId(userId);
    if (errorResponse) return errorResponse;

    const { text } = await request.json();
    if (!text?.trim()) return Response.json({ error: "Text is required" }, { status: 400 });

    const lastTask = await prisma.task.findFirst({
      where: { userId },
      orderBy: { order: "desc" },
    });
    const newOrder = lastTask ? lastTask.order + 1 : 1;

    const newTask = await prisma.task.create({
      data: {
        text: text.trim(),
        userId,
        order: newOrder,
        priority: "MEDIUM",
      },
    });

    return Response.json({ data: newTask });
  } catch (error) {
    console.error("POST error:", error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}