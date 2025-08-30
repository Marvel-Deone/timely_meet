import { db } from "@/lib/db/prisma";

export const bookingRepository = {
  findEventById: (id: string) =>
    db.event.findUnique({
      where: { id },
      include: { user: true },
    }),

  create: (data: any) => db.booking.create({ data }),

  findById: (id: string) =>
    db.booking.findUnique({
      where: { id },
      include: {
        event: {
          include: { user: true },
        },
      },
    }),

  delete: (id: string) => db.booking.delete({ where: { id } }),
};
