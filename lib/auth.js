import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export function createAccessToken(userId) {
  const secret = process.env.ACCESS_TOKEN_SIGNATURE;
  if (!secret) {
    throw new Error("ACCESS_TOKEN_SIGNATURE is not defined in .env");
  }

  return jwt.sign({ userId }, secret, {
    expiresIn: "15m",
  });
}

export function createRefreshToken(userId) {
  const secret = process.env.REFRESH_TOKEN_SIGNATURE;
  if (!secret) {
    throw new Error("REFRESH_TOKEN_SIGNATURE is not defined in .env");
  }

  return jwt.sign({ userId }, secret, {
    expiresIn: "7d",
  });
}

export function getUserIdFromCookies() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  if (!accessToken?.value) return null;

  try {
    const decoded = jwt.verify(
      accessToken.value,
      process.env.ACCESS_TOKEN_SIGNATURE
    );
    return decoded.userId;
  } catch (err) {
    console.error("Invalid token:", err.message);
    return null;
  }
}

