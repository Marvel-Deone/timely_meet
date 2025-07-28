import { getUserMeetings } from "@/actions/meetings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Suspense } from "react"
import MeetingList from "./_component/meeting-list"
// import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, Users, Video } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Your Meetings | TimelyMeet",
  description: "View and manage your upcoming and past meetings.",
}

// Loading skeleton for stats
const StatsLoading = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
    {[1, 2, 3, 4].map((i) => (
      <Card key={i} className="bg-white border shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-12" />
            </div>
            <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

const Meeting = () => {
  return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Meetings</h1>
            <p className="text-gray-600 mt-1">View and manage your upcoming and past meetings</p>
          </div>
        </div>

        {/* Stats Cards */}
        <Suspense fallback={<StatsLoading />}>
          <MeetingStats />
        </Suspense>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger
              className="cursor-pointer data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
              value="upcoming"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
              value="past"
            >
              Past
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            <Suspense fallback={<MeetingListLoading />}>
              <UpcomingMeetings />
            </Suspense>
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            <Suspense fallback={<MeetingListLoading />}>
              <PastMeetings />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
  )
}

// Stats component
const MeetingStats = async () => {
  // You can fetch actual stats here
  const upcomingRes = await getUserMeetings("upcoming")
  const pastRes = await getUserMeetings("past")

  const upcomingMeetings = upcomingRes && "data" in upcomingRes ? upcomingRes.data : []
  const pastMeetings = pastRes && "data" in pastRes ? pastRes.data : []

  const totalMeetings = upcomingMeetings.length + pastMeetings.length
  const todayMeetings = upcomingMeetings.filter((meeting: any) => {
    const today = new Date()
    const meetingDate = new Date(meeting.start_time)
    return meetingDate.toDateString() === today.toDateString()
  }).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <Card className="bg-white border shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Meetings</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{totalMeetings}</p>
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
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{upcomingMeetings.length}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{todayMeetings}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Video className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{pastMeetings.length}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Loading skeleton for meeting list
const MeetingListLoading = () => (
  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="bg-white border shadow-sm">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
)

const UpcomingMeetings = async () => {
  const res = await getUserMeetings("upcoming")
  const meetings = res && "data" in res ? res.data : []
  return <MeetingList meetings={meetings} type="upcoming" />
}

const PastMeetings = async () => {
  const res = await getUserMeetings("past")
  const meetings = res && "data" in res ? res.data : []
  return <MeetingList meetings={meetings} type="past" />
}

export default Meeting
