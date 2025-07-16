import { getEventAvailability, getEventDetails } from "@/actions/event";
import { notFound } from "next/navigation";
import EventDetails from "./_components/event-details";
import { Suspense } from "react";
import { RiseLoader } from "react-spinners";
import BookingForm from "./_components/booking-form";

type EventPageProps = {
    params: {
        username: string;
        eventId: string;
    };
};

export const generateMetadata = async ({ params }: EventPageProps) => {
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

const EventPage = async ({ params }: EventPageProps) => {
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