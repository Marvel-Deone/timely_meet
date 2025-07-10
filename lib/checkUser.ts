import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";


export const checkUser = async () => {
    const user = await currentUser();

    if (!user) return null;

    // Check if loggedInUser is not in the DB
    try {
        const loggedInUser = await db?.user?.findUnique({
            where: {
                clerk_user_id: user.id
            }
        });

        if (loggedInUser) {
            return loggedInUser;
        }
        const name = `${user.firstName} ${user.lastName}`;

        (await clerkClient()).users.updateUser(user.id, {
            username: name.split(" ").join("_") + user.id.slice(-4)
        });

        const newUser = await db.user.create({
            data: {
                clerk_user_id: user.id,
                name,
                image_url: user.imageUrl,
                email: user.emailAddresses[0].emailAddress,
                username: name.split(" ").join("_") + user.id.slice(-4)
            }
        });
        return newUser;
    } catch (err) {
        console.log('err:', err);
    }
}