import jwt from "jsonwebtoken";

export function createAccessToken(userId) {
  const token = jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN_SIGNATURE,
    {
      expiresIn: "15m",
      algorithm: "HS256",
      issuer: "tasks-ai",
    }
  );

  return token;
}