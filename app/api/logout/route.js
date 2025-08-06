import { getLogoutHeaders } from "../../../lib/auth";

export async function POST() {
  return new Response(
    JSON.stringify({ message: "Logged out" }),
    {
      status: 200,
      headers: getLogoutHeaders(),
    }
  );
}
