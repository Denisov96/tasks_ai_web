import { prisma } from "../../../prisma/db";
import { getUserIdFromCookies } from "../../../lib/auth";

export async function GET() {
  try {
    const userId = getUserIdFromCookies();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        completed: true,
        NOT: { completedAt: null },
      },
      select: {
        id: true,
        text: true,
        completedAt: true,
      },
      orderBy: {
        completedAt: "desc",
      },
    });

    return new Response(
      JSON.stringify(tasks),
      { status: 200 }
    );
  } catch (error) {
    console.error("Task history error:", error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
