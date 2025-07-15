'use server';

import { db } from "@/lib/prisma";
import { error, success } from "@/utils/response";
import { auth } from "@clerk/nextjs/server"

export const getUserMeetings = async (type = "upcoming") => {
    const { userId } = await auth();

    if (!userId) {
        return error("Unauthorized", 401, "Unauthorized");
    }

    const user = await db.user.findUnique({ where: { clerk_user_id: userId } });

    if (!user) {
        return error("User not found", 404, "Not Found");
    }

    const now = new Date();

    const meetings = await db.booking.findMany({
        where: {
            user_id: user.id,
            start_time: type === "upcoming" ? { gte: now } : { lt: now },
        },
        include: {
            event: {
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            start_time: type === "upcoming" ? 'asc' : 'desc',
        },
    });

    return success("Meetings fetched successsfullu", meetings)
}