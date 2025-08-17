'use server';

import { db } from "@/lib/db/prisma";
import { error, success } from "@/lib/response";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const updateUsername = async (username: string) => {
    const { userId } = await auth();

    if (!userId) return error("Unauthorized", 401, "Unauthorized");

    const userWithSameUsername = await db.user.findUnique({ where: { username } });

    if (userWithSameUsername) {
        if (userWithSameUsername.clerk_user_id === userId) {
            return success("User profile updated successfully", null);
        }

        if (userWithSameUsername.clerk_user_id !== userId) {
            return error("Username is already taken", 403, "Bad request");
        }
    }

    await db.user.update({
        where: { clerk_user_id: userId },
        data: { username }
    });

    await (await clerkClient()).users.updateUser(userId, { username });

    return success("User profile updated successfully", null);
};

export const getUserByUsername = async (username: string) => {
    const user = await db.user.findUnique({
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
                    _count: {
                        select: { bookings: true }
                    }
                }
            }
        }
    });

    return user;
}