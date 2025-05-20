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
}
