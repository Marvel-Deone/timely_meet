import { getUserEvents } from "@/actions/event";
import EventCard from "@/components/dashboard/event-card";
import Toaster from "@/components/dashboard/Toaster";
import { Event } from "@/lib/types/event.types";
import { AlertColor } from "@mui/material";
import Image from "next/image";
import { Suspense } from "react";
import { RiseLoader } from "react-spinners";

type EventsResponse = {
  events: Event[];
  username: string;
};

const EventsPage = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-[70vh]"><RiseLoader /></div>}>
      <Events />
    </Suspense>
  )
}

const Events = async () => {
  const res = await getUserEvents();
  let events: Event[] = [];
  let response: EventsResponse = { events: [], username: "" };
  if ('data' in res && res.data) {
    response = res.data as EventsResponse;
    events = await (res?.data?.events ?? []).map((event: any) => ({
      ...event,
      description: event.description ?? "",
    }));
    if (events?.length === 0) {
      return <div className="flex flex-col mt-1 gap-3 items-center justify-center w-[100%] h-[70vh]">
        <Image src="/images/empty_event.svg" alt="Notification" width={200} height={42} className="!w-[40%]" />
        <span>You haven&apos;t created any events yet.</span>
      </div>
    }
    // You can use res.data here
  } else {
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      {Array.isArray(events) && events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          username={response?.username}
          is_public={false}
        />
      ))}
    </div>
  )
}

export default EventsPage;
