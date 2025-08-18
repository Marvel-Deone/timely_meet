import { auth } from "@clerk/nextjs/server";
import { updateUsername, getUserProfile } from "@/lib/services/user.service";

export async function POST(req: Request) {
  const { username } = await req.json();
  const { userId } = await auth();

  if (!userId) {
    return Response.json(
      { success: false, error: { message: "Unauthorized", code: 401, status: "Unauthorized" } },
      { status: 401 }
    );
  }

  const result = await updateUsername(userId, username);

  if (!result.success) {
    return Response.json(result, { status: result.error.code });
  }

  return Response.json(result, { status: 200 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return Response.json(
      { success: false, error: { message: "Invalid username", code: 400, status: "Bad Request" } },
      { status: 400 }
    );
  }

  const result = await getUserProfile(username);

  if (!result.success) {
    return Response.json(result, { status: result.error.code });
  }

  return Response.json(result, { status: 200 });
}
