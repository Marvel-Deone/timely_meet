"use client"

import { Suspense, useEffect, useState } from "react"
import { Calendar, Clock, Users, Link, Trash2, Plus, Search, MoreVertical, Eye, Edit, Globe, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { BarLoader, RiseLoader } from "react-spinners"
import { getUserEvents } from "@/actions/event"
import { Event } from "@/lib/types/event.types"
import Image from "next/image"
import useFetch from "@/hooks/use-fetch"
// import DashboardLayout from "@/components/dashboard-layout"

type EventsResponse = {
  events: Event[];
  username: string;
};

// Function to generate consistent color based on event properties
const generateEventColor = (event: Event): string => {
  const colors = ["blue", "green", "purple", "orange", "pink", "indigo", "teal", "red"]

  // Create a simple hash from the event ID to ensure consistency
  let hash = 0
  for (let i = 0; i < event.id.length; i++) {
    const char = event.id.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  // Use absolute value and modulo to get a consistent index
  const colorIndex = Math.abs(hash) % colors.length
  return colors[colorIndex]
}

// Mock data - replace with your actual data
// const events = [
//   {
//     id: 1,
//     title: "Testing",
//     description: "Testing",
//     duration: 40,
//     isPublic: false,
//     bookings: 2,
//     color: "blue",
//   },
//   {
//     id: 2,
//     title: "1:1 Discussion",
//     description: "Discuss about anything",
//     duration: 45,
//     isPublic: true,
//     bookings: 0,
//     color: "green",
//   },
//   {
//     id: 3,
//     title: "Does Professionalism really matters?",
//     description: "Does Professionalism really matters in tech?",
//     duration: 45,
//     isPublic: true,
//     bookings: 2,
//     color: "purple",
//   },
// ]

const EventCard = ({ event }: { event: Event }) => {
  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/event/${event.id}`)
    toast.success("Event link copied to clipboard!")
  }

  const deleteEvent = () => {
    toast.success("Event deleted successfully!")
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-indigo-500",
      green: "from-green-500 to-emerald-500",
      purple: "from-purple-500 to-pink-500",
      orange: "from-orange-500 to-red-500",
      pink: "from-pink-500 to-rose-500",
      indigo: "from-indigo-500 to-purple-500",
      teal: "from-teal-500 to-cyan-500",
      red: "from-red-500 to-pink-500",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-0 bg-white/60 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getColorClasses(generateEventColor(event))}`} />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-gray-900 truncate">{event.title}</CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {event.duration} mins
                </div>
                <div className="flex items-center gap-1">
                  {event.is_private ? (
                    <>
                      <Globe className="w-4 h-4" />
                      Public
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Private
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit Event
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={deleteEvent}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</CardDescription>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span className="font-medium">{event._count.bookings}</span>
              <span>booking{event._count.bookings !== 1 ? "s" : ""}</span>
            </div>
            {event._count.bookings > 0 && (
              <div className="flex -space-x-1">
                {Array.from({ length: Math.min(event._count.bookings, 3) }).map((_, i) => (
                  <Avatar key={i} className="w-6 h-6 border-2 border-white">
                    <AvatarFallback className="text-xs bg-gray-100">{String.fromCharCode(65 + i)}</AvatarFallback>
                  </Avatar>
                ))}
                {event._count.bookings > 3 && (
                  <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                    +{event._count.bookings - 3}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={copyLink} className="bg-transparent">
              <Link className="w-4 h-4" />
            </Button>
            <Badge variant={event._count.bookings > 0 ? "default" : "secondary"} className="capitalize">
              {event._count.bookings > 0 ? "Active" : "No bookings"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const EventsPage = () => {
  return (
    <Suspense fallback={<div className="w-full"><BarLoader /></div>}>
      <Events />
    </Suspense>
  )
}

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const { data: userEvents, loading, error, fn: fetchUserEvents } = useFetch(getUserEvents);

  useEffect(() => {
    fetchUserEvents();
  }, []);

  const myevents = userEvents;

  console.log('events', myevents);


  // const res = getUserEvents();
  let events: Event[] = [];
  let response: EventsResponse = { events: [], username: "" };
  if (myevents?.events) {
    events = (myevents?.events ?? []).map((event: any) => ({
      ...event,
      description: event.description ?? "",
    }));
    // response = res.data as EventsResponse;
    // events = await (res?.data?.events ?? []).map((event: any) => ({
    //   ...event,
    //   description: event.description ?? "",
    // }));
    if (events?.length === 0) {
      return <div className="flex flex-col mt-1 gap-3 items-center justify-center w-[100%] h-[70vh]">
        <Image src="/images/empty_event.svg" alt="Notification" width={200} height={42} className="!w-[40%]" />
        <span className="mt-3 font-[600]">You haven&apos;t created any events yet.</span>
      </div>
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      filterType === "all" ||
      (filterType === "public" && event.is_private) ||
      (filterType === "private" && !event.is_private) ||
      (filterType === "active" && event._count.bookings > 0)

    return matchesSearch && matchesFilter
  })

  return (
    // <DashboardLayout>
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">Manage your meeting events and bookings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-white border shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{events.length}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                  {events.reduce((sum, event) => sum + event._count.bookings, 0)}
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Public Events</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                  {events.filter((e) => e.is_private).length}
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                  {events.filter((e) => e._count.bookings > 0).length}
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/50 border-gray-200/50"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("all")}
          >
            All
          </Button>
          <Button
            variant={filterType === "public" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("public")}
          >
            Public
          </Button>
          <Button
            variant={filterType === "private" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("private")}
          >
            Private
          </Button>
          <Button
            variant={filterType === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("active")}
          >
            Active
          </Button>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <Card className="bg-white border shadow-sm">
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterType !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first event"}
            </p>
            {!searchQuery && filterType === "all" && (
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Event
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
    // {/* </DashboardLayout> */}
  )
}

export default EventsPage;
