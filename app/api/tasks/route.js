export const dynamic = "force-dynamic";

import { getAllTasks, getTasks } from "../../../lib/db";
import { prisma } from "../../../prisma/db";

export async function GET(request) {
  const userId = parseInt(request.headers.get("userid"));
  return Response.json({
    message: "That's all your tasks",
    data: await getTasks(userId),
    error: null,
  });
}

export async function POST(request) {
  const userId = parseInt(request.headers.get("userid"));
  const data = await request.text();

  await prisma.task.create({
    data: { text: data, userId },
  });

  return Response.json({
    message: "New task was created",
    data: await getTasks(userId),
    error: null,
  });
}

export async function PUT(request) {
  try {
    const userIdHeader = request.headers.get("userid");
    const userId = userIdHeader ? parseInt(userIdHeader, 10) : null;

    const { id, completed, text } = await request.json();

    if (!id || (completed === undefined && !text)) {
      return Response.json({}, { status: 400 });
    }

    await prisma.task.update({
      where: { id, userId }, 
      data: { completed, text },
    });

    return Response.json({
      message: "Task was updated",
      data: await getTasks(userId),
      error: null,
    });
  } catch (error) {
    return Response.json({}, { status: 500 });
  }
}


export async function DELETE(request) {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids)) return new Response(null, { status: 400 });

    await prisma.task.deleteMany({ where: { id: { in: ids } } });

    const data = await getAllTasks();
    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
