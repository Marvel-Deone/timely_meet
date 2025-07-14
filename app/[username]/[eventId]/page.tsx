import { getEventDetails } from "@/actions/event";

export const generateMetadata = async ({ params }: { params: { username: string, eventId: string } }) => {
    const { username, eventId } = params;
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
    const { username, eventId } = params;
    const event = await getEventDetails(username, eventId);
    
    return (
        <div>

        </div>
    )
}

export default EventPage;