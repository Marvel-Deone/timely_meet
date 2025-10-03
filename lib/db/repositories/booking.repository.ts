import { db } from "@/lib/db/prisma";
import { Prisma } from "@/lib/generated/prisma";

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

  createBookingsFromVotes: (
    tx: Prisma.TransactionClient,
    eventId: string,
    userId: string,
    option: { start_time: Date; end_time: Date },
    votes: Array<{ name: string; email: string }>
  ) => {
    return tx.booking.createMany({
      data: votes.map((vote) => ({
        event_id: eventId,
        user_id: userId,
        name: vote.name,
        email: vote.email,
        start_time: option.start_time,
        end_time: option.end_time,
        meet_link: "",
        google_event_id: "",
      })),
    });
  },

   attachMeetLink: (
    tx: Prisma.TransactionClient,
    eventId: string,
    meetLink: string,
    googleEventId: string
  ) => {
    return tx.booking.updateMany({
      where: { event_id: eventId },
      data: { meet_link: meetLink, google_event_id: googleEventId },
    });
  },
  delete: (id: string) => db.booking.delete({ where: { id } }),
};
