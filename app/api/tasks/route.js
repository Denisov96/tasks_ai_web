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



