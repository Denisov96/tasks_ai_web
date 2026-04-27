import { prisma } from "../../../../prisma/db";
import { getUserIdFromCookies } from "../../../../lib/auth";
import { validateUserId } from "../../../../lib/requests";
import { getTasks } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function PUT(request) {
  try {
    const userId = getUserIdFromCookies(request);
    const errorResponse = validateUserId(userId);
    if (errorResponse) return errorResponse;

    const { taskId, completed, text, priority, order } = await request.json();

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.userId !== userId) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    const updateData = {};
    if (typeof completed === "boolean") updateData.completed = completed;
    if (typeof text === "string") updateData.text = text.trim();
    if (priority && ["LOW", "MEDIUM", "HIGH"].includes(priority))
      updateData.priority = priority;
    if (typeof order === "number") updateData.order = order;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    return Response.json({ data: updatedTask });
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

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.userId !== userId) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    await prisma.taskHistory.create({
      data: {
        text: task.text,
        completedAt: new Date(),
        userId,
      },
    });

    await prisma.task.delete({
      where: { id: taskId },
    });

    const tasks = await getTasks(userId);
    return Response.json({ data: tasks });
  } catch (error) {
    console.error("DELETE error:", error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
