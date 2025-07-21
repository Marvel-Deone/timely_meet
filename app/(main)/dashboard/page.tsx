"use client"

import { useState } from "react"
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  Copy,
  Edit3,
  BarChart3,
  Video,
  CheckCircle,
  ArrowRight,
  Settings,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

const recentEvents = [
  { name: "Team Standup", time: "9:00 AM", attendees: 5, status: "completed" },
  { name: "Client Review", time: "2:00 PM", attendees: 3, status: "upcoming" },
  { name: "Project Planning", time: "4:30 PM", attendees: 8, status: "upcoming" },
]

const upcomingMeetings = [
  { title: "Design Review", time: "Tomorrow, 10:00 AM", participants: ["John", "Sarah", "Mike"] },
  { title: "Sprint Planning", time: "Wed, 2:00 PM", participants: ["Team Alpha"] },
]

const DashboardPage = () => {
  const [username, setUsername] = useState("dev_coder")
  const [isEditing, setIsEditing] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(`http://localhost:3000/${username}`)
  }

  return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 md:p-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12 md:w-16 md:h-16 ring-4 ring-white/20">
                <AvatarImage src="/placeholder.svg?height=64&width=64" />
                <AvatarFallback className="bg-white/20 text-white text-xl">M</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Marvel!</h1>
                <p className="text-blue-100 text-sm md:text-base">Ready to manage your schedule efficiently?</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100 mb-1">Today</div>
              <div className="text-xl md:text-2xl font-bold">
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">24</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% from last month
                  </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">8</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1" />3 today
                  </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Video className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Attendees</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">156</p>
                  <p className="text-xs text-purple-600 flex items-center mt-1">
                    <Users className="w-3 h-3 mr-1" />
                    Avg 6.5 per event
                  </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">94%</p>
                  <Progress value={94} className="mt-2 h-2" />
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Your Unique Link */}
          <div className="lg:col-span-2">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg h-full">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  Your Unique Link
                </CardTitle>
                <CardDescription className="text-sm">
                  Share this link to let others book meetings with you
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-200/50">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-600 mb-1">Your booking URL</div>
                    <div className="font-mono text-sm bg-white px-3 py-2 rounded-lg border break-all">
                      http://localhost:3000/{username}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={copyLink} className="shrink-0 bg-transparent">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Input value={username} onChange={(e) => setUsername(e.target.value)} className="flex-1" />
                      <Button size="sm" onClick={() => setIsEditing(false)}>
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="font-mono text-sm bg-white px-3 py-2 rounded-lg border flex-1">{username}</div>
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Meetings */}
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Upcoming
                </span>
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 space-y-3">
              {upcomingMeetings.map((meeting, index) => (
                <div key={index} className="p-3 bg-gray-50/50 rounded-lg border border-gray-200/50">
                  <div className="font-medium text-sm text-gray-900 mb-1">{meeting.title}</div>
                  <div className="text-xs text-gray-600 mb-2">{meeting.time}</div>
                  <div className="flex -space-x-1">
                    {meeting.participants.map((participant, i) => (
                      <Avatar key={i} className="w-6 h-6 border-2 border-white">
                        <AvatarFallback className="text-xs">{participant[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-sm">Your latest events and meetings</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="space-y-4">
              {recentEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-200/50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        event.status === "completed" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {event.status === "completed" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{event.name}</div>
                      <div className="text-sm text-gray-600">
                        {event.time} • {event.attendees} attendees
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={event.status === "completed" ? "default" : "secondary"}
                    className="capitalize self-start sm:self-center"
                  >
                    {event.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  )
}

export default DashboardPage;
