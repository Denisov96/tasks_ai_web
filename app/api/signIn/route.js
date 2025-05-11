import { prisma } from "../../../prisma/db";
import bcrypt from "bcrypt";

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12)
  const hash = await bcrypt.hash(password, salt)

  return hash
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

  const match = await bcrypt.compare(password, user.password)

  if (match === false) {
    return Response.json({
      data: null,
      errror: "Wrong password"
    })
  }

  return Response.json({
    data: user,
    error: null,
    message: "Success",
  });
}

