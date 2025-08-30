import { db } from "@/lib/db/prisma";

export const availabilityRepository = {
  findByUserId: (userId: string) =>
    db.user.findUnique({
      where: { clerk_user_id: userId },
      include: { availability: { include: { days: true } } },
    }),

  update: (availabilityId: string, time_gap: number, daysData: any[]) =>
    db.availability.update({
      where: { id: availabilityId },
      data: {
        time_gap,
        days: { deleteMany: {}, create: daysData },
      },
    }),

  create: (userId: string, time_gap: number, daysData: any[]) =>
    db.availability.create({
      data: {
        user_id: userId,
        time_gap,
        days: { create: daysData },
      },
    }),
};
