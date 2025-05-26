import { prisma } from "../../../prisma/db";
import bcrypt from "bcrypt";


export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ data: null, error: "Invalid JSON" }, { status: 400 });
  }

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export async function POST(request) {
  const { userName, password } = await request.json();


  const { username, password } = body;
  if (!username || !password) {
    return Response.json({ data: null, error: "Username and password are required" }, { status: 400 });
  }


  const user = await prisma.user.findFirst({ where: { name: username } });
  if (!user) {
    return Response.json({ data: null, error: "User not found" }, { status: 404 });
  }

  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return Response.json({ data: null, error: "Incorrect password" }, { status: 401 });
  }

  return Response.json({
    data: { id: user.id, name: user.name },
    error: null,
    message: "Success",
  });

  if (user === null) {
    user = await prisma.user.create({
      data: {
        name: userName,
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
