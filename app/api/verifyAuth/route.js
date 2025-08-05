import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { createAccessToken } from "../../../lib/auth";

export async function GET() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken");

  if (!refreshToken?.value) {
    return new Response(JSON.stringify({ error: "No refresh token" }), {
      status: 401,
    });
  }

  try {
    const decoded = jwt.verify(
      refreshToken.value,
      process.env.REFRESH_TOKEN_SIGNATURE
    );

    const newAccessToken = createAccessToken(decoded.userId);

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append(
      "Set-Cookie",
      `accessToken=${newAccessToken}; HttpOnly; Path=/; Max-Age=900; SameSite=Lax; Secure`
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid refresh token" }), {
      status: 401,
    });
  }
}
