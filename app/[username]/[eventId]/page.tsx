import { getEventAvailability, getEventDetails } from "@/actions/event";
import { notFound } from "next/navigation";
import EventDetails from "./_components/event-details";
import { Suspense } from "react";
import { RiseLoader } from "react-spinners";
import BookingForm from "./_components/booking-form";

export const generateMetadata = async ({ params }: { params: { username: string, eventId: string } }) => {
    const { username, eventId } = await params;
    const event = await getEventDetails(username, eventId);

    if (!event) {
        return {
            title: "Event not found"
        }
    }

    return {
        title: `${event.title} with ${event.user.name} | TimelyMeet`,
        description: `Schedule a ${event.duration}-minute ${event.title} event with ${event.user.name}.`,
    }
}

interface EventPageProps {
    params: {
        username: string;
        eventId: string;
    };
}

const EventPage = async ({ params }: { params: { username: string, eventId: string } }) => {
    const { username, eventId } = await params;
    const event = await getEventDetails(username, eventId);
    const availability = await getEventAvailability(eventId)

    if (!event) {
        notFound();
    }

    return (
        <div className="flex flex-col lg:flex-row justify-center px-4 py-8">
            <EventDetails event={event} />
            <Suspense fallback={<div className="flex justify-center items-center h-[50vh]"><RiseLoader /></div>}>
                <BookingForm event={event} availability={availability} />
            </Suspense>
        </div>
    )
}

export default EventPage;