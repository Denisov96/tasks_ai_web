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

    const { taskId, completed, text } = await request.json();

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.userId !== userId) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    const updateData = {};

    if (typeof completed === "boolean" && completed !== task.completed) {
      updateData.completed = completed;

      if (completed === true) {
        const completionDate = new Date();
        updateData.completedAt = completionDate;

        
        await prisma.taskHistory.create({
          data: {
            text: task.text,
            completedAt: completionDate,
            userId,
          },
        });

      } else {
        updateData.completedAt = null;
      }
    }

    if (typeof text === "string") {
      updateData.text = text.trim();
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.task.update({
        where: { id: taskId },
        data: updateData,
      });
    }

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

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.userId !== userId) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    
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