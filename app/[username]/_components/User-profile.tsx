"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { notFound } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, Clock, Users, Globe, Link, ArrowRight } from "lucide-react"

interface UserProfileProps {
  user: {
    name?: string | null
    image_url?: string | null
    events?: Array<{
      id: string
      description: string | null
      title: string
      duration: number
      is_private: boolean
      _count: {
        bookings: number
      }
      [key: string]: any
    }> | null
    [key: string]: any
  } | null
  username: string
}

const UserProfile = ({ user, username }: UserProfileProps) => {
  if (!user) {
    notFound()
  }

  const publicEvents = user?.events?.filter((event) => !event.is_private) || []

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Public Profile indicator */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TimelyMeet
              </span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Globe className="w-3 h-3 mr-1" />
              Public Profile
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Simple Profile Section - closer to original */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-2 mb-8"
        >
          <Avatar className="w-20 h-20 mb-4 shadow-md">
            <AvatarImage src={user?.image_url ?? ""} alt={user?.name ?? ""} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-[16px] text-gray-600 text-center max-w-sm">
            Hey there 👋 — I'm {user.name}. Select any of the events below to connect with me!
          </p>
        </motion.div>

        {/* Events Section */}
        {publicEvents.length === 0 ? (
          <div className="flex flex-col gap-5 mt-20 items-center w-[100%] h-[70vh]">
            <Image
              src="/images/public_event.svg"
              alt="Empty state illustration"
              width={200}
              height={38}
              className="!w-[300px] sm:!w-[400px] md:!w-[30%] shadow-md"
            />
            <span className="font-semibold mt-3">No events yet. Please check back soon.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {publicEvents.map((event) => (
              <PublicEventCard
                key={event.id}
                event={{
                  ...event,
                  description: event.description ?? "",
                  _count: {
                    bookings: event._count.bookings,
                  },
                }}
                username={username}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Simple Event Card - closer to your original but slightly enhanced
const PublicEventCard = ({
  event,
  username,
}: {
  event: {
    id: string
    title: string
    description: string
    duration: number
    _count: { bookings: number }
  }
  username: string
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-2">{event.title}</h3>
          {event._count.bookings > 0 && (
            <Badge variant="secondary" className="text-xs">
              Active
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {event.duration} mins
          </div>
          <div className="flex items-center gap-1">
            <Globe className="w-4 h-4" />
            Public
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-6 leading-relaxed">{event.description}</p>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>
              {event._count.bookings} booking{event._count.bookings !== 1 ? "s" : ""}
            </span>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
            <Link className="w-4 h-4" />
          </Button>
        </div>

        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          <a href={`/${username}/${event.id}`}>
            Book This Event
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}

export default UserProfile
