import { db } from "@/lib/db/prisma";
import { error } from "@/lib/response";

export const eventRepository = {
    create: (data: any) =>
        // db.event.create({ data })
        db.event.create({
            data: {
                title: data.title,
                description: data.description,
                type: data.type,
                duration: data.duration,
                capacity: data.capacity,
                is_private: data.is_private,
                user_id: data.user_id,
                poll_options: data.poll_options
                    ? { create: data.poll_options }
                    : undefined,
            },
        }),


    findById: (eventId: string) => {
        return db.event.findUnique({
            where: { id: eventId },
            include: {
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
                                event: {
                                    select: {
                                        type: true,
                                        capacity: true
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
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
                poll_options: {
                    select: {
                        id: true,
                        event_id: true,
                        start_time: true,
                        end_time: true
                    }
                }
            },
        }),

    findUserEvents: async (userId: string) => {
        const user = await db.user.findUnique({ where: { clerk_user_id: userId } });
        if (!user) return error("User not found", 404, "Not Found");
        const events = await db.event.findMany({
            where: { user_id: user.id },
            orderBy: { created_at: "desc" },
            include: {
                _count: { select: { bookings: true } },
            },
        });
        const data = { events, username: user.username };
        return data;
    },

    delete: (eventId: string) =>
        db.event.delete({ where: { id: eventId } }),

    update: (eventId: string, data: any) =>
        db.event.update({ where: { id: eventId }, data }),
};
