export const dynamic = "force-dynamic";

import { getAllTasks } from "../../../lib/db";
import { prisma } from "../../../prisma/db";

export async function GET() {
  return Response.json({
    message: "That's all your tasks",
    data: await getAllTasks(),
    error: null,
  });
}

export async function POST(request) {
  const data = await request.text();

  await prisma.task.create({
    data: { text: data },
  });

  return Response.json({
    data: await getAllTasks(),
    error: null,
    message: "New task was created",
  });
}

export async function PUT(request) {
  try {
    const { id, completed } = await request.json();

    if (!id || typeof completed !== "boolean") {
      return Response.json({}, { status: 400 });
    }

    await prisma.task.update({
      where: { id },
      data: { completed },
    });

    return Response.json({
      data: await getAllTasks(),
    });
  } catch {
    return Response.json({}, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids)) 
      return new Response(null, { status: 400 });

    await prisma.task.deleteMany({ where: { id: { in: ids } } });

    const data = await getAllTasks();
    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
