import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Video, User, MessageSquare } from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"
import CancelMeeting from "./cancel-meeting"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Meeting {
  id: string
  name: string | null
  email: string
  duration: number
  start_time: Date
  end_time: Date
  event: {
    title: string
    description: string | null
  }
  additional_info?: string | null
  meeting_link: string
}

interface MeetingListProps {
  meetings: any
  type: string
}

const MeetingList = ({ meetings, type }: MeetingListProps) => {
  if (meetings.length === 0) {
    return (
      <Card className="bg-white border shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/images/empty_meeting.svg"
              alt={`No ${type} meetings found.`}
              width={200}
              height={200}
              className="w-32 h-32 mb-4 opacity-50"
            />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No {type} meetings found</h3>
            <p className="text-gray-600">
              {type === "upcoming"
                ? "You don't have any upcoming meetings scheduled."
                : "You haven't had any meetings yet."}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {Array.isArray(meetings) &&
        meetings.map((meeting) => (
          <Card
            key={meeting.id}
            className="group hover:shadow-lg transition-all duration-200 border-0 bg-white/60 backdrop-blur-sm h-full"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 break-words leading-tight mb-2">
                    {meeting.event.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <CardDescription className="text-sm font-medium">with {meeting.name}</CardDescription>
                  </div>
                  {meeting.additional_info && (
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <CardDescription className="text-sm italic break-words">
                        "{meeting.additional_info}"
                      </CardDescription>
                    </div>
                  )}
                </div>
                <Badge variant={type === "upcoming" ? "default" : "secondary"} className="capitalize flex-shrink-0">
                  {type}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{format(new Date(meeting.start_time), "MMMM d, yyyy")}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-green-500" />
                <span>
                  {format(new Date(meeting.start_time), "h:mm a")} - {format(new Date(meeting.end_time), "h:mm a")}
                </span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {meeting.event.duration}m
                </Badge>
              </div>

              {meeting.meet_link && (
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-500" />
                  <Button asChild variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-800 text-sm">
                    <a href={meeting.meet_link} target="_blank" rel="noopener noreferrer">
                      Join Meeting
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-0 mt-auto">
              <div className="flex gap-2 w-full">
                {type === "upcoming" && <CancelMeeting bookingId={meeting.id} />}
                {meeting.meet_link && (
                  <Button
                    asChild
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    <a href={meeting.meet_link} target="_blank" rel="noopener noreferrer">
                      <Video className="w-4 h-4 mr-2" />
                      Join Meeting
                    </a>
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
    </div>
  )
}

export default MeetingList
