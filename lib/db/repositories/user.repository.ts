import { db } from "../prisma";

export async function findUserByUsername(username: string) {
  return db.user.findUnique({ where: { username } });
}

export async function updateUserByClerkId(userId: string, data: { username?: string }) {
  return db.user.update({
    where: { clerk_user_id: userId },
    data,
  });
}

export async function getUserProfileWithEvents(username: string) {
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
