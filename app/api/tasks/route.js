export const dynamic = "force-dynamic";

import { prisma } from "../../../prisma/db";

export async function GET() {
  const tasks = await prisma.task.findMany();

  return Response.json({
    message: "Thats your all tasks",
    data: tasks,
    error: null,
  });
}

export async function POST(request) {
  const data = await request.text();
  await prisma.task.create({
    data: { text: data },
  });

  const allTasks = await prisma.task.findMany();

  return Response.json({
    data: allTasks,
    error: null,
    message: "New task was created",
  });
}
