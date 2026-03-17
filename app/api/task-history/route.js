import { prisma } from "../../../prisma/db";
import { getUserIdFromCookies } from "../../../lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const userId = getUserIdFromCookies(request);

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const history = await prisma.taskHistory.findMany({
      where: { userId },
      select: {
        id: true,
        text: true,
        completedAt: true,
      },
      orderBy: {
        completedAt: "desc",
      },
    });

    return new Response(JSON.stringify(history), { status: 200 });
  } catch (error) {
    console.error("Task history error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
