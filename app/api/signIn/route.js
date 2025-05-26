import { prisma } from "../../../prisma/db";
import bcrypt from "bcrypt";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON" }),
      { status: 400 }
    );
  }

  const { username, password } = body;

  if (!username || !password) {
    return new Response(
      JSON.stringify({ error: "Username and password are required" }),
      { status: 400 }
    );
  }

  const user = await prisma.user.findFirst({
    where: { name: username },
  });

  if (!user) {
    return new Response(
      JSON.stringify({ error: "User not found" }),
      { status: 404 }
    );
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return new Response(
      JSON.stringify({ error: "Incorrect password" }),
      { status: 401 }
    );
  }

  return new Response(
    JSON.stringify({
      data: { id: user.id, name: user.name },
      message: "Sign in successful",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}


