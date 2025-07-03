import jwt from "jsonwebtoken";

export function createAccessToken(username) {
  const token = jwt.sign(
    { username },
    process.env.ACCESS_TOKEN_SIGNATURE,
    {
      expiresIn: "15m",
      algorithm: "HS256",
      issuer: "tasks-ai",
    }
  );

  return token;
}