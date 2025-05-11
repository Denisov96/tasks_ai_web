import { prisma } from "../prisma/db";

export async function getTasks(userId) {
  return await prisma.task.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
