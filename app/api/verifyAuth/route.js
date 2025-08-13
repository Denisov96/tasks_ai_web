import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  if (!accessToken?.value) {
    return new Response(JSON.stringify({ error: "No access token" }), {
      status: 401,
    });
  }

  try {
    const decoded = jwt.verify(
      accessToken.value,
      process.env.ACCESS_TOKEN_SIGNATURE
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid access token" }), {
      status: 401,
    });
  }
}

