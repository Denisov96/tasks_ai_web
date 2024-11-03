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
