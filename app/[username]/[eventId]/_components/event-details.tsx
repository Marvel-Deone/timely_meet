"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Calendar, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react"

interface EventDetailsProps {
    event: {
        id: string
        created_at: Date
        updated_at: Date
        title: string
        description: string | null
        duration: number
        user_id: string
        is_private: boolean
        user: {
            name: string | null
            email: string
            username: string
            image_url: string | null
        }
    }
}

const EventDetails = ({ event }: EventDetailsProps) => {
     const [locationOrigin, setLocationOrigin] = useState<string>("");
    const { user } = event;

    useEffect(() => {
        if (typeof window !== "undefined" && user) {
            setLocationOrigin(window.location.origin);
        }
    }, [user]);

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0 mb-6">
                <CardTitle className="text-3xl font-bold text-gray-900 mb-3">{event.title}</CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {event.description || "No description provided for this event."}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 ring-2 ring-blue-100">
                        <AvatarImage src={user?.image_url ?? ""} alt={user?.name ?? ""} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Link href={`${locationOrigin}/${user?.username || ""}`} target="_blank">
                        <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
                        <p className="text-sm text-gray-600">@{user.username}</p>
                    </Link>
                </div>
                <div className="flex items-center text-gray-700">
                    <Clock className="mr-3 h-5 w-5 text-blue-600" />
                    <span className="font-medium">{event.duration} minutes</span>
                </div>
                <div className="flex items-center text-gray-700">
                    <Calendar className="mr-3 h-5 w-5 text-green-600" />
                    <span className="font-medium">Google Meet</span>
                </div>
                <div className="flex items-center text-gray-700">
                    <Info className="mr-3 h-5 w-5 text-purple-600" />
                    <span className="font-medium">This is a public event.</span>
                </div>
            </CardContent>
        </Card>
    )
}

export default EventDetails;
