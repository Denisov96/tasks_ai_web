import { prisma } from "../../../prisma/db";
import bcrypt from "bcrypt";

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export async function POST(request) {
  const { username, password } = await request.json();

  let user = await prisma.user.findFirst({
    where: {
      name: username,
    },
  });

  if (user === null) {
    user = await prisma.user.create({
      data: {
        name: username,
        password: await hashPassword(password),
      },
    });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return new Response(
      JSON.stringify({
        data: null,
        error: "Wrong password",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({
      data: user,
      error: null,
      message: "Success",
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
