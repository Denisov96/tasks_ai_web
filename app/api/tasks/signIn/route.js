import { prisma } from "../../../prisma/db";

export async function POST(request) {
  const userName = await request.text();

  let user = await prisma.user.findFirst({
    where: {
      name: userName,
    },
  });

  if (user === null) {
    user = await prisma.user.create({
      data: {
        name: userName,
      },
    });
  }

  return Response.json({
    data: user,
    error: null,
    message: "Success",
  });
}