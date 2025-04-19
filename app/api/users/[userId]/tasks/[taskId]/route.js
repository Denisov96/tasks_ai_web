export const dynamic = "force-dynamic";
import { prisma } from "../../../../../../prisma/db";

function validateUserId(userId) {
  if (isNaN(userId)) {
    return Response.json({ error: "Invalid User ID" }, { status: 400 });
  }
  return null;
}

async function fetchTasks(userId) {
  return await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function PUT(request, { params }) {
  try {
    const userId = parseInt(params.userId);
    const taskId = parseInt(params.taskId);

    const errorResponse = validateUserId(userId);
    if (errorResponse) return errorResponse;

    if (isNaN(taskId)) {
      return Response.json({ error: "Invalid Task ID" }, { status: 400 });
    }

    const { completed, text } = await request.json();

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

    const tasks = await fetchTasks(userId);
    return Response.json({ data: tasks });
  } catch (error) {
    console.error("PUT error:", error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const userId = parseInt(params.userId);
    const taskId = parseInt(params.taskId);

    const errorResponse = validateUserId(userId);
    if (errorResponse) return errorResponse;

    if (isNaN(taskId)) {
      return Response.json({ error: "Invalid Task ID" }, { status: 400 });
    }

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.userId !== userId) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    await prisma.task.delete({ where: { id: taskId } });

    const tasks = await fetchTasks(userId);
    return Response.json({ data: tasks });
  } catch (error) {
    console.error("DELETE error:", error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
