export const dynamic = "force-dynamic";
import { prisma } from "../../../prisma/db";

async function getTasks(userId) {
  return await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function GET(request) {
  try {
    const userIdHeader = request.headers.get("userid");
    if (!userIdHeader) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const userId = parseInt(userIdHeader);
    if (isNaN(userId)) {
      return Response.json({ error: "Invalid User ID" }, { status: 400 });
    }

    const tasks = await getTasks(userId);

    return Response.json({
      message: "Tasks retrieved successfully",
      data: tasks,
      error: null,
    });
  } catch (error) {
    console.error("GET Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userIdHeader = request.headers.get("userid");
    if (!userIdHeader) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const userId = parseInt(userIdHeader);
    if (isNaN(userId)) {
      return Response.json({ error: "Invalid User ID" }, { status: 400 });
    }

    const { text } = await request.json();
    if (!text || typeof text !== "string") {
      return Response.json({ error: "Task text is required" }, { status: 400 });
    }

    await prisma.task.create({
      data: {
        text: text.trim(),
        userId,
      },
    });

    return Response.json({
      message: "Task created successfully",
      data: await getTasks(userId),
      error: null,
    });
  } catch (error) {
    console.error("POST Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const userIdHeader = request.headers.get("userid");
    if (!userIdHeader) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const userId = parseInt(userIdHeader);
    if (isNaN(userId)) {
      return Response.json({ error: "Invalid User ID" }, { status: 400 });
    }

    const { id, completed, text } = await request.json();

    if (!id) {
      return Response.json({ error: "Task ID is required" }, { status: 400 });
    }

    if (completed === undefined && !text) {
      return Response.json(
        { error: "Either completed status or text must be provided" },
        { status: 400 }
      );
    }

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.userId !== userId) {
      return Response.json(
        { error: "Task not found or access denied" },
        { status: 404 }
      );
    }

    const updateData = {};
    if (completed !== undefined) updateData.completed = completed;
    if (text) updateData.text = text.trim();

    await prisma.task.update({
      where: { id },
      data: updateData,
    });

    return Response.json({
      message: "Task updated successfully",
      data: await getTasks(userId),
      error: null,
    });
  } catch (error) {
    console.error("PUT Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const userIdHeader = request.headers.get("userid");
    if (!userIdHeader) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const userId = parseInt(userIdHeader);
    if (isNaN(userId)) {
      return Response.json({ error: "Invalid User ID" }, { status: 400 });
    }

    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return Response.json(
        { error: "Array of task IDs is required" },
        { status: 400 }
      );
    }

    const existingTasks = await prisma.task.findMany({
      where: {
        id: { in: ids },
        userId,
      },
    });

    if (existingTasks.length !== ids.length) {
      return Response.json(
        { error: "Some tasks not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.task.deleteMany({
      where: {
        id: { in: ids },
        userId,
      },
    });

    return Response.json({
      message: "Tasks deleted successfully",
      data: await getTasks(userId),
      error: null,
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
