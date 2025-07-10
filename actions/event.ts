'use server'

import { eventSchema } from "@/app/lib/validators";
import { db } from "@/lib/prisma";
import { error, success } from "@/utils/response";
import { auth } from "@clerk/nextjs/server";

export const createEvent = async (data: typeof eventSchema._input) => {
    const { userId } = await auth();

    if (!userId) {
        return error("Unauthorized", 401, "Unauthorized");
    }

    const validatedData = eventSchema.parse(data);

    const user = await db.user.findUnique({ where: { clerk_user_id: userId } });
    if (!user) {
        return error("User not found", 404, "Not Found");
    }

    const event = await db.event.create({
        data: {
            ...validatedData,
            user_id: user.id
        }
    });

    return success('Event created successfully', event);
}

export const getUserEvents = async () => {
    const { userId } = await auth();

    if (!userId) {
        return error("Unauthorized", 401, "Unauthorized");
    }

    const user = await db.user.findUnique({ where: { clerk_user_id: userId } });
    if (!user) return error("User not found", 404, "Not Found");

    const events = await db.event.findMany({
        where: { user_id: user.id },
        orderBy: { created_at: "desc" },
        include: {
            _count: {
                select: { bookings: true }
            },
        },
    });
    const data = { events, username: user.username }
    return success('User events fetched successfully', data);
}

export const deleteEvent = async (eventId: string) => {
    const { userId } = await auth();

    if (!userId) {
        return error("Unauthorized", 401, "Unauthorized");
    }


    const user = await db.user.findUnique({ where: { clerk_user_id: userId } });
    if (!user) {
        return error("User not found", 404, "Not Found");
    }

    const event = await db.event.findUnique({ where: { id: eventId } });

    if (!event || event.user_id !== user.id) {
        return error("Event not found or unauthorized", 404, "Not Found");
    }

    await db.event.delete({
        where: { id: eventId }
    });

    return success('Event deleted successfully');
}