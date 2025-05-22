import { prisma } from "../../../prisma/db";
import bcrypt from "bcrypt";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { data: null, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const { username, password, confirmPassword } = body;
  if (!username || !password || !confirmPassword) {
    return Response.json(
      { data: null, error: "All fields are required" },
      { status: 400 }
    );
  }
  if (password !== confirmPassword) {
    return Response.json(
      { data: null, error: "Passwords do not match" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findFirst({ where: { name: username } });
  if (existing) {
    return Response.json(
      { data: null, error: "User already exists" },
      { status: 409 }
    );
  }

  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name: username, password: hash },
  });

  return Response.json({
    data: { id: user.id, name: user.name },
    error: null,
    message: "User created successfully",
  });
}
