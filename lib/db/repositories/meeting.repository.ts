import { db } from "@/lib/db/prisma";

export const findMeetingsByUser = async (
  userId: string,
  type: "upcoming" | "past" = "upcoming"
) => {
  const now = new Date();

  return db.booking.findMany({
    where: {
      user_id: userId,
      start_time: type === "upcoming" ? { gte: now } : { lt: now },
    },
    include: {
      event: {
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
    orderBy: {
      start_time: type === "upcoming" ? "asc" : "desc",
    },
  });
};
