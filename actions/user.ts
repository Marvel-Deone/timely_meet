'use server'

import { db } from "@/lib/prisma";
import { error, success } from "@/utils/response";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const updateUsername = async (username: string) => {
    const { userId } = await auth();

    if (!userId) return error("Unauthorized", 401, "Unauthorized");

    const userWithSameUsername = await db.user.findUnique({ where: { username } });

    if (userWithSameUsername) {
        if (userWithSameUsername.clerk_user_id === userId) {
            return success("User profile updated successfully");
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

    return success("User profile updated successfully");
};
