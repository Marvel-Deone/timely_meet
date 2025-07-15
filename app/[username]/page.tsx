import { getUserByUsername } from "@/actions/user";
import UserProfile from "@/components/dashboard/user/User-profile";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export const generateMetadata = async ({ params }: { params: { username: string } }) => {
    const { username } = await params;
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
    const { username } = await params;
    const user = await getUserByUsername(username);

    if (!user) {
        notFound();
    }
    return <UserProfile user={user!} username={username} />;
    // return (
    //     <div className="container mx-auto px-4 py-8">
    //         <motion.div
    //             initial={{ opacity: 0, y: 20 }}
    //             animate={{ opacity: 1, y: 0 }}
    //             transition={{ duration: 0.6 }}
    //             className="flex flex-col items-center gap-2 mb-6"
    //         >
    //             <img src={user?.image_url ?? ''} className="w-20 h-20 rounded-full shadow-md" />
    //             <h2 className="text-xl font-semibold">Marvel pro</h2>
    //             <p className="text-sm text-gray-600 text-center max-w-sm">
    //                 Hey there 👋 — I’m Marvel. Select any of the events below to connect with me!
    //             </p>
    //         </motion.div>

    //         <div className="flex flex-col items-center mb-8">
    //             <Avatar className="w-24 h-24 mb-4 shadow-md">
    //                 <AvatarImage src={user?.image_url ?? ''} alt={user?.name ?? ''} />
    //                 <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
    //             </Avatar>
    //             <h1>{user.name}</h1>
    //             <p>Hey there 👋 — I’m {user.name}. Select any of the events below to connect with me!</p>
    //         </div>

    //         {user?.events?.length === 0 ? (
    //             <div className="flex flex-col mt-1 gap-3 items-center justify-center w-[100%] h-[70vh]">
    //                 <Image src="/images/empty_event.svg" alt="Notification" width={200} height={42} className="!w-[40%]" />
    //                 <span>No events yet. Please check back soon.</span>
    //             </div>
    //         ) : (
    //             <div className="grid grid-cols-1 sm:grid-cols-2 md::grid-cols-3 gap-6">
    //                 {user?.events.map((event) => (
    //                     <EventCard
    //                         key={event.id}
    //                         event={{
    //                             ...event,
    //                             description: event.description ?? ""
    //                         }}
    //                         username={params.username}
    //                         is_public
    //                     />
    //                 ))}
    //             </div>
    //         )}
    //     </div>
    // )
}

export default UserPage;
