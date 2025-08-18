import UserProfile from "@/app/[username]/_components/User-profile";
import { findUserByUsername } from "@/lib/db/repositories/user.repository";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export const generateMetadata = async ({ params }: { params: Promise<{ username: string }> }) => {
    const { username } = await params;
    const user = await findUserByUsername(username);

    if (!user) {
        return {
            title: "User not found",
        }
    }

    return {
        title: `${user.name}'s Profile | TimelyMeet`,
        description: `Book an event with ${user.name}. View available public events and schedules.`,
    }
}

const UserPage = async ({ params }: { params: Promise<{ username: string }> }) => {
    const { username } = await params;
    const user = await findUserByUsername(username);

    if (!user) {
        notFound();
    }

    return <UserProfile user={user!} username={username} />
}

export default UserPage;
