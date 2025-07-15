import { getUserMeetings } from "@/actions/meetings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import MeetingList from "./_component/meeting-list";


export const metadata = {
    title: "Your Meetings | TimelyMeet",
    description: "View and manage your upcoming and past meetings."
};

const Meeting = () => {
    return (
        <Tabs defaultValue="upcoming">
            <TabsList>
                <TabsTrigger className="cursor-pointer" value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="past">Past</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
                <Suspense fallback={<div>Loading upcoming meetings...</div>}>
                    <UpcomingMeetings />
                </Suspense>
            </TabsContent>
            <TabsContent value="past">
                <Suspense fallback={<div>Loading past meetings...</div>}>
                    <PastMeetings />
                </Suspense>
            </TabsContent>
        </Tabs>
    )
}

const UpcomingMeetings = async () => {
    const res = await getUserMeetings("upcoming");
    const meetings = res && "data" in res ? res.data : [];
    return <MeetingList meetings={meetings} type="upcoming" />;
}

const PastMeetings = async () => {
    const res = await getUserMeetings("past");
    const meetings = res && "data" in res ? res.data : [];
    return <MeetingList meetings={meetings} type="past" />;
}

export default Meeting;