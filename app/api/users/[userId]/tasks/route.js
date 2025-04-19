export const dynamic = "force-dynamic";
import { prisma } from "../../../../../prisma/db";

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

export async function GET(request, { params }) {
  try {
    const userId = parseInt(params.userId);
    const errorResponse = validateUserId(userId);
    if (errorResponse) return errorResponse;

    const tasks = await fetchTasks(userId);
    return Response.json({ data: tasks });
  } catch (error) {
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const userId = parseInt(params.userId);
    const errorResponse = validateUserId(userId);
    if (errorResponse) return errorResponse;

    const { text } = await request.json();
    if (!text?.trim()) {
      return Response.json({ error: "Text is required" }, { status: 400 });
    }

    await prisma.task.create({
      data: { text: text.trim(), userId },
    });

    return Response.json({ data: await fetchTasks(userId) });
  } catch (error) {
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const userId = parseInt(params.userId);
    const errorResponse = validateUserId(userId);
    if (errorResponse) return errorResponse;

    const { id, completed, text } = await request.json();
    if (!id)
      return Response.json({ error: "Task ID required" }, { status: 400 });

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== userId) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    const updateData = {};
    if (completed !== undefined) updateData.completed = completed;
    if (text) updateData.text = text.trim();

    await prisma.task.update({ where: { id }, data: updateData });
    return Response.json({ data: await fetchTasks(userId) });
  } catch (error) {
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const userId = parseInt(params.userId);
    const errorResponse = validateUserId(userId);
    if (errorResponse) return errorResponse;

    const body = await request.text();
    console.log("DELETE request body:", body);

    const { id, ids } = JSON.parse(body);
    if (!id && !ids?.length) {
      return Response.json({ error: "ID(s) required" }, { status: 400 });
    }

    if (id) {
      await prisma.task.delete({ where: { id: Number(id) } });
    } else {
      await prisma.task.deleteMany({
        where: { id: { in: ids.map(Number) }, userId }
      });
    }

    return Response.json({ data: await fetchTasks(userId) });
  } catch (error) {
    console.error("DELETE error:", error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
