import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  if (!accessToken) {
    return new Response(JSON.stringify({ error: "No access token provided" }), {
      status: 400,
    });
  }

  try {
    const decoded = jwt.verify(
      accessToken.value,
      process.env.ACCESS_TOKEN_SIGNATURE
    );

    return new Response(JSON.stringify(decoded), {
      status: 200,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return new Response(
        JSON.stringify({ error: "Access token expired" }),
        { status: 401 }
      );
    }
    return new Response(
      JSON.stringify({ error: "Invalid access token!" }),
      { status: 401 }
    );
  }
}

