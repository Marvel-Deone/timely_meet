"use client";;

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Calendar, Info, Users, Vote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { getEventTypeInfo } from "@/lib/common";

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
    type: "ONE_ON_ONE" | "GROUP" | "POLL" | "ROUND_ROBIN" | "COLLECTIVE";
    capacity?: number | null
    poll_options?: Array<{
      id: string
      start_time: Date
      end_time: Date
      votes?: number
    }>
    user: {
      name: string | null
      email: string
      username: string
      image_url: string | null
    }
  }
}

const EventDetails = ({ event }: EventDetailsProps) => {
  const [locationOrigin, setLocationOrigin] = useState<string>("")
  const { user } = event

  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      setLocationOrigin(window.location.origin)
    }
  }, [user])

  const eventTypeInfo = getEventTypeInfo(event.type);
  const EventTypeIcon = eventTypeInfo.icon;

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="p-0 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <CardTitle className="text-3xl font-bold text-gray-900">{event.title}</CardTitle>
          <Badge className={`${eventTypeInfo.color} border-0`}>
            <EventTypeIcon className="w-3 h-3 mr-1" />
            {eventTypeInfo.label}
          </Badge>
        </div>
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

        {event.type === "GROUP" && (
          <div className="flex items-center text-gray-700">
            <Users className="mr-3 h-5 w-5 text-green-600" />
            <span className="font-medium">
              {event.capacity ? `Max ${event.capacity} participants` : "Unlimited participants"}
            </span>
          </div>
        )}

        {event.type === "POLL" && event.poll_options && event.poll_options.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center text-gray-700">
              <Vote className="mr-3 h-5 w-5 text-purple-600" />
              <span className="font-medium">Available Time Options:</span>
            </div>
            <div className="ml-8 space-y-2">
              {event.poll_options.map((option, index) => (
                <div key={option.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-700">
                    {format(new Date(option.start_time), "yyyy-MM-dd HH:mm")} -{" "}
                    {format(new Date(option.end_time), "yyyy-MM-dd HH:mm")}
                    {/* {new Date(option.start_time).toLocaleString()} - {new Date(option.end_time).toLocaleString()} */}
                  </span>
                  {option.votes !== undefined && (
                    <Badge variant="secondary" className="text-xs">
                      {option.votes} votes
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center text-gray-700">
          <Calendar className="mr-3 h-5 w-5 text-green-600" />
          <span className="font-medium">Google Meet</span>
        </div>

        <div className="flex items-center text-gray-700">
          <Info className="mr-3 h-5 w-5 text-purple-600" />
          <span className="font-medium">
            {event.is_private ? "This is a private event." : "This is a public event."}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default EventDetails
