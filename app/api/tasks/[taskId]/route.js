import { prisma } from "../../../../prisma/db";
import { getUserIdFromCookies } from "../../../../lib/auth";
import { getTasks } from "../../../../lib/db";
import { validateUserId } from "../../../../lib/requests";

export const dynamic = "force-dynamic";

export async function PUT(request) {
  try {
    const userId = getUserIdFromCookies(request);
    const errorResponse = validateUserId(userId);
    if (errorResponse) return errorResponse;

    const { taskId, completed, text } = await request.json();

    if (isNaN(taskId)) {
      return Response.json({ error: "Invalid Task ID" }, { status: 400 });
    }

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.userId !== userId) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    const updateData = {};
    if (completed !== undefined) updateData.completed = completed;
    if (text) updateData.text = text.trim();

    await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    const tasks = await getTasks(userId);
    return Response.json({ data: tasks });
  } catch (error) {
    console.error("PUT error:", error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const userId = getUserIdFromCookies(request);
    const errorResponse = validateUserId(userId);
    if (errorResponse) return errorResponse;

    const { taskId } = await request.json();

    if (isNaN(taskId)) {
      return Response.json({ error: "Invalid Task ID" }, { status: 400 });
    }

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.userId !== userId) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    await prisma.task.delete({ where: { id: taskId } });

    const tasks = await getTasks(userId);
    return Response.json({ data: tasks });
  } catch (error) {
    console.error("DELETE error:", error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
