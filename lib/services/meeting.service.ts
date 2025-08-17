import { auth } from "@clerk/nextjs/server";
import { error, success } from "@/lib/response";
import { db } from "@/lib/db/prisma";
import { findMeetingsByUser } from "../db/repositories/meeting.repository";
// import { findMeetingsByUser } from "@/lib/repositories/meeting.repository";

export const getUserMeetings = async (type: "upcoming" | "past" = "upcoming") => {
  const { userId } = await auth();

  if (!userId) {
    return error("Unauthorized", 401, "Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerk_user_id: userId },
  });

  if (!user) {
    return error("User not found", 404, "Not Found");
  }

  const meetings = await findMeetingsByUser(user.id, type);

  return success("Meetings fetched successfully", meetings);
};
