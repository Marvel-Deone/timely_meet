// app/api/user/route.ts
import { getUserByUsername } from "@/actions/user";
import { db } from "@/lib/prisma";
import { error, success } from "@/lib/response";
import { auth, clerkClient } from "@clerk/nextjs/server";

// Handle POST request
export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    const { userId } = await auth();

    if (!userId) {
      return Response.json(error("Unauthorized", 401), { status: 401 });
    }

    const userWithSameUsername = await db.user.findUnique({ where: { username } });

    if (userWithSameUsername) {
      if (userWithSameUsername.clerk_user_id !== userId) {
        return Response.json(error("Username is already taken", 403, "Bad request"), { status: 403 });
      }
      // same user trying to update with same username -> no action needed
      return Response.json(success("User profile updated successfully", null));
    }

    await db.user.update({
      where: { clerk_user_id: userId },
      data: { username },
    });

    await (await clerkClient()).users.updateUser(userId, { username });

    return Response.json(success("User profile updated successfully", null));
  } catch (err) {
    console.error("API Error:", err);
    return Response.json(error("Internal server error", 500), { status: 500 });
  }
}

// Handle GET request
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return Response.json(error("Invalid username", 400), { status: 400 });
    }

    // const user = await db.user.findUnique({
    //   where: { username },
    //   select: {
    //     id: true,
    //     name: true,
    //     email: true,
    //     image_url: true,
    //     events: {
    //       where: { is_private: false },
    //       select: {
    //         id: true,
    //         title: true,
    //         description: true,
    //         duration: true,
    //         is_private: true,
    //         _count: { select: { bookings: true } },
    //       },
    //     },
    //   },
    // });

    const user = await getUserByUsername(username);

    if (!user) return Response.json(error("user not found", 404), { status: 404 });

    return Response.json(user);
  } catch (err) {
    console.error("API Error:", err);
    return Response.json(error("Internal server error", 500), { status: 500 });
  }
}
