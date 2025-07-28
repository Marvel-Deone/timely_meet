import { getEventAvailability, getEventDetails } from "@/actions/event"
import { notFound } from "next/navigation"
import EventDetails from "./_components/event-details"
import BookingForm from "./_components/booking-form"
import { Suspense } from "react"
import { Loader2 } from "lucide-react" // Using Lucide-React for icons

type Props = {
  params: {
    username: string
    eventId: string
  }
}

export const generateMetadata = async ({ params }: { params: Promise<{ username: string; eventId: string }> }) => {
  const { username, eventId } = await params
  const event = await getEventDetails(username, eventId)

  if (!event) {
    return { title: "Event not found" }
  }

  return {
    title: `${event.title} with ${event.user.name} | TimelyMeet`,
    description: `Schedule a ${event.duration}-minute ${event.title} event with ${event.user.name}.`,
  }
}

const EventPage = async ({ params }: { params: Promise<{ username: string; eventId: string }> }) => {
  const { username, eventId } = await params
  const event = await getEventDetails(username, eventId)
  const availability = await getEventAvailability(eventId)

  if (!event) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:flex">
        {/* Event Details Section */}
        <div className="md:w-1/2 p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-200">
          <EventDetails event={event} />
        </div>

        {/* Booking Form Section */}
        <div className="md:w-1/2 p-8 md:p-10">
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            }
          >
            <BookingForm event={event} availability={availability} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default EventPage
