import { auth } from "@/lib/auth"; // ✅ imported from your authOptions file

export async function GET() {
  const session = await auth(); // ✅ This returns the session directly

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json(session.user);
}
