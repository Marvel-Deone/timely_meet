import { db } from "@/lib/db/prisma";

export const eventRepository = {
    create: (data: any) =>
        db.event.create({ data }),

    findById: (eventId: string) => {
        return db.event.findUnique({
            where: { id: eventId },
            include: {
                // user: {
                //   include: {
                //     availability: true,
                //     bookings: true,
                //   },
                // },
                user: {
                    include: {
                        availability: {
                            select: {
                                days: true,
                                time_gap: true,
                            },
                        },
                        bookings: {
                            select: {
                                start_time: true,
                                end_time: true,
                            },
                        },
                    },
                },
            },
        });
        //   db.event.findUnique({ where: { id: eventId } }),
    },

    findByIdAndUser: (eventId: string, userId: string) =>
        db.event.findFirst({
            where: { id: eventId, user: { clerk_user_id: userId } },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        username: true,
                        image_url: true,
                    },
                },
            },
        }),

    findByUsernameAndId: (username: string, eventId: string) =>
        db.event.findUnique({
            where: { id: eventId, user: { username } },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        username: true,
                        image_url: true,
                    },
                },
            },
        }),

    findUserEvents: (userId: string) =>
        db.event.findMany({
            where: { user_id: userId },
            orderBy: { created_at: "desc" },
            include: {
                _count: { select: { bookings: true } },
            },
        }),

    delete: (eventId: string) =>
        db.event.delete({ where: { id: eventId } }),

    update: (eventId: string, data: any) =>
        db.event.update({ where: { id: eventId }, data }),
};
