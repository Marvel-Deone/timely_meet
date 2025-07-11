import { getUserByUsername } from "@/actions/user";
import EventCard from "@/components/dashboard/event-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }: { params: { username: string } }) => {
    const { username } = params;
    const user = await getUserByUsername(username);
    if (!user) {
        return {
            title: "User not found"
        }
    }

    return {
        title: `${user.name}'s Profile | TimelyMeet`,
        description: `Book an event with ${user.name}. View available public events and schedules.`
    }
}

interface UserPageProps {
    params: {
        username: string,
        [key: string]: any
    }
}

const UserPage = async ({ params }: UserPageProps) => {
    const { username } = params;
    const user = await getUserByUsername(username);
    console.log('user:', user);

    if (!user) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center mb-8">
                <Avatar className="w-24 h-24 mb-4 shadow-md">
                    <AvatarImage src={user?.image_url ?? ''} alt={user?.name ?? ''} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <h1>{user.name}</h1>
                <p>Hey there 👋 — I’m {user.name}. Select any of the events below to connect with me!</p>
            </div>

            {user?.events?.length === 0 ? (
                <div className="flex flex-col mt-1 gap-3 items-center justify-center w-[100%] h-[70vh]">
                    <Image src="/images/empty_event.svg" alt="Notification" width={200} height={42} className="!w-[40%]" />
                    <span>No events yet. Please check back soon.</span>
                </div>
            ): (
                <div className="grid grid-cols-1 sm:grid-cols-2 md::grid-cols-3 gap-6">
                    {user?.events.map((event) => (
                        <EventCard
                            key={event.id}
                            event={{
                                ...event,
                                description: event.description ?? ""
                            }}
                            username={params.username}
                            is_public
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default UserPage;
