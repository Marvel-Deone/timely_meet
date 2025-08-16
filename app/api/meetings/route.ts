import { db } from "@/lib/prisma";
import { error, success } from "@/lib/response";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json(error("Unauthorized", 401, "Unauthorized"), { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerk_user_id: userId },
    });

    if (!user) {
      return Response.json(error("User not found", 404, "Not Found"), { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") ?? "upcoming";
    const now = new Date();

    const meetings = await db.booking.findMany({
      where: {
        user_id: user.id,
        start_time: type === "upcoming" ? { gte: now } : { lt: now },
      },
      include: {
        event: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        start_time: type === "upcoming" ? "asc" : "desc",
      },
    });

    return Response.json(success("Meetings fetched successfully", meetings), { status: 200 });
  } catch (err) {
    console.error("API Error:", err);
    return Response.json(error("Internal server error", 500), { status: 500 });
  }
}
