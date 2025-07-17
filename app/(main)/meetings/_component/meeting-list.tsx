import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Video } from "lucide-react";

import { format } from "date-fns";
import Image from "next/image";
import CancelMeeting from "./cancel-meeting";
interface Meeting {
    id: string;
    name: string | null;
    email: string;
    duration: number;
    start_time: Date;
    end_time: Date;
    event: {
        title: string;
        description: string | null;
    };
    additional_info?: string | null;
    meeting_link: string;
}

interface MeetingListProps {
    meetings: any;
    type: string;
}

const MeetingList = ({ meetings, type }: MeetingListProps) => {
    console.log('meeting:', { typeOf: typeof (meetings), meetings }, 'types:', { typeOf: typeof (type), type });
    if (meetings.length === 0) {
        return <div className="flex flex-col mt-1 gap-3 items-center justify-center w-[100%] h-[70vh]">
            <Image src="/images/empty_meeting.svg" alt={`No ${type} meetings found.`} width={200} height={42} className="!w-[40%]" />
            <span className="mt-3 font-[600]">No {type} meetings found.</span>
        </div>
    }

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-6">
            {Array.isArray(meetings) && meetings.map((meeting) => (
                <Card key={meeting.id} className='flex flex-col justify-between rounded-xl shadow transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg cursor-pointer'>
                    <CardHeader>
                        <CardTitle className='text-2xl'>{meeting.event.title}</CardTitle>
                        <CardDescription>with {meeting.name}</CardDescription>
                        <CardDescription>
                            &quot;{meeting.additional_info}&quot;
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center mb-4">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>{format(new Date(meeting.start_time), "MMMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center mb-4">
                            <Clock className="mr-2 h-4 w-4" />
                            <span>
                                {format(new Date(meeting.start_time), "h:mm a")} -{" "}
                                {format(new Date(meeting.end_time), "h:mm a")}
                            </span>
                        </div>
                        {meeting.meet_link && (
                            <div className="flex items-center">
                                <Video className="mr-2 h-4 w-4" />
                                <a href={meeting.meet_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Join Meeting</a>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className='flex gap-2'>
                        <CancelMeeting bookingId={meeting.id} />
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

export default MeetingList;