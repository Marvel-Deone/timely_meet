import { db } from "../prisma";


export const userRepository = {
    findUserById(id: string) {
        return db.user.findUnique({ where: { clerk_user_id: id } });
    },

    findUserByUsername(username: string) {
        return db.user.findUnique({ where: { username } });
    },

    updateUserByClerkId(userId: string, data: { username?: string }) {
        return db.user.update({
            where: { clerk_user_id: userId },
            data,
        });
    },

    getUserProfileWithEvents(username: string) {
        return db.user.findUnique({
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
                        _count: { select: { bookings: true } },
                    },
                },
            },
        });
    }
}
