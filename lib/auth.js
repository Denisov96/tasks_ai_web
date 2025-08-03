import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export function getUserIdFromCookies() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  if (!accessToken?.value) return null;

  try {
    const decoded = jwt.verify(
      accessToken.value,
      process.env.ACCESS_TOKEN_SIGNATURE
    );
    return Number(decoded.userId);
  } catch (err) {
    console.error("Invalid token:", err.message);
    return null;
  }
}

export function createAccessToken(userId) {
  const secret = process.env.ACCESS_TOKEN_SIGNATURE;
  if (!secret) {
    throw new Error(
      "ACCESS_TOKEN_SIGNATURE is not defined in environment variables"
    );
  }

  return jwt.sign({ userId }, secret, {
    expiresIn: "15m",
  });
}
