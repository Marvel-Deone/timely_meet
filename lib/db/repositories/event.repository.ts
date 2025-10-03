import { db } from "@/lib/db/prisma";
import { Prisma } from "@/lib/generated/prisma";
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
                  poll_options: {
                    select: {
                        id: true,
                        event_id: true,
                        start_time: true,
                        end_time: true,
                        votes: {
                            select: {
                                id: true,
                                voter_name: true,
                                voter_email: true,
                            },
                        },
                    },
                },
            },
        }),

    findPollEventById: (eventId: string, userId: string) =>
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
                poll_options: {
                    select: {
                        id: true,
                        event_id: true,
                        start_time: true,
                        end_time: true,
                        votes: {
                            select: {
                                id: true,
                                voter_name: true,
                                voter_email: true,
                            },
                        },
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
                    },
                },
            },
        }),

    findUserEvents: async (userId: string, params?: {
        type?: string;
        status?: string;
    }) => {
        const user = await db.user.findUnique({ where: { clerk_user_id: userId } });
        if (!user) return error("User not found", 404, "Not Found");
        // where with optional filters
        const whereClause: any = { user_id: user.id };
        if (params?.type) {
            whereClause.type = params.type;
        }

        if (params?.status) {
            whereClause.status = params.status;
        }

        let events;

        if (params?.type && params.type === "POLL") {
            events = await db.event.findMany({
                where: whereClause,
                orderBy: { created_at: "desc" },
                include: {
                    poll_options: {
                        select: {
                            id: true,
                            event_id: true,
                            start_time: true,
                            end_time: true,
                             _count: { select: { votes: true } },
                        },
                    },
                    _count: { select: { bookings: true } },
                },
            });
        } else {
            events = await db.event.findMany({
                where: whereClause,
                orderBy: { created_at: "desc" },
                include: {
                    _count: { select: { bookings: true } },
                },
            });
        }

        const data = { events, username: user.username };
        return data;
    },

    finalizeEvent: (tx: Prisma.TransactionClient, eventId: string, optionId: string) => {
        return tx.event.update({
            where: { id: eventId },
            data: {
                status: "finalized",
                finalized_option_id: optionId,
            },
            include: {
                poll_options: {
                    select: {
                        id: true,
                        event_id: true,
                        start_time: true,
                        end_time: true,
                        votes: {
                            select: {
                                id: true,
                                voter_name: true,
                                voter_email: true,
                            },
                        },
                    }
                },
                user: true,
            },
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

    delete: (eventId: string) =>
        db.event.delete({ where: { id: eventId } }),

    update: (eventId: string, data: any) =>
        db.event.update({ where: { id: eventId }, data }),
};
