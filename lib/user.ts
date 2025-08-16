import { db } from "@/lib/prisma";

export const getUserByUsername = async (username: string) => {
  return db.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      email: true,
      image_url: true,
      events: {
        where: { is_private: false },
        select: {
          id: true,
          title: true,
          description: true,
          duration: true,
          is_private: true,
          _count: { select: { bookings: true } },
        },
      },
    },
  });
}
