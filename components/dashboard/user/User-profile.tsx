'use client';

import EventCard from "@/components/dashboard/event-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";

interface UserProfileProps {
    user: {
        name?: string | null;
        image_url?: string | null;
        events?: Array<{
            id: string;
            description: string | null;
            title: string,
            duration: number,
            is_private: boolean,
            _count: {
                bookings: number
            },
            [key: string]: any;
        }> | null;
        [key: string]: any;
    } | null;
    username: string;
}

const UserProfile = ({ user, username }: UserProfileProps) => {
    if (!user) {
        notFound();
    }
    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center gap-2 mb-6"
            >
                <Avatar className="w-20 h-20 mb-4 shadow-md">
                    <AvatarImage src={user?.image_url ?? ''} alt={user?.name ?? ''} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                {/* <img src={user?.image_url ?? ''} className="w-20 h-20 rounded-full shadow-md" /> */}
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-[16px] text-gray-600 text-center max-w-sm">
                    Hey there 👋 — I’m {user.name}. Select any of the events below to connect with me!
                </p>
            </motion.div>

            {user?.events?.length === 0 ? (
                <div className="flex flex-col gap-5 mt-20 items-center w-[100%] h-[70vh]">
                    <Image src="/images/public_event.svg" alt="Empty state illustration" width={200} height={38} className="!w-[300px] sm:!w-[400px] md:!w-[30%] shadow-md" />
                    <span className="font-semibold mt-3">No events yet. Please check back soon.</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md::grid-cols-3 gap-6">
                    {user?.events?.map((event) => (
                        <EventCard
                            key={event.id}
                            event={{
                                ...event,
                                description: event.description ?? "",
                                _count: {
                                    bookings: event._count.bookings
                                }
                            }}
                            username={username}
                            is_public
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default UserProfile
