import { prisma } from "../prisma/db";

export async function getTasks(userId) {
  return prisma.task.findMany({
    where: { userId },
    orderBy: [
      { completed: "asc" },
      { priority: "desc" },
      { order: "asc" }
    ]
  });
}
