"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from "@/lib/utils/validators";
import useFetch, { useFetchs } from "@/hooks/use-fetch";
import { updateUsername } from "@/actions/user";
import { toast } from "sonner";
import { formatMeetingTime } from "@/lib/common";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchMeetings } from "@/lib/fetcher";

const recentEvents = [
    { name: "Team Standup", time: "9:00 AM", attendees: 5, status: "completed" },
    { name: "Client Review", time: "2:00 PM", attendees: 3, status: "upcoming" },
    { name: "Project Planning", time: "4:30 PM", attendees: 8, status: "upcoming" },
]

const upcomingMeetings = [
    { title: "Design Review", time: "Tomorrow, 10:00 AM", participants: ["John", "Sarah", "Mike"] },
    { title: "Sprint Planning", time: "Wed, 2:00 PM", participants: ["Team Alpha"] },
]

const UpcomingMeetingsSkeleton = () => (
    <Card className="bg-white border shadow-sm">
        <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-16" />
            </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 space-y-3">
            {[1, 2].map((i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24 mb-2" />
                    <div className="flex gap-1">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="w-6 h-6 rounded-full" />
                    </div>
                </div>
            ))}
        </CardContent>
    </Card>
)
const RecentActivitySkeleton = () => (
    <Card className="bg-white border shadow-sm">
        <CardHeader className="p-4 md:p-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-10 h-10 rounded-lg" />
                            <div>
                                <Skeleton className="h-4 w-24 mb-1" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
)
const UpcomingMeetings = () => {
    const { data, error, isLoading } = useQuery({
        queryKey: ["meetings", "upcoming"], // cache key
        queryFn: () => fetchMeetings("upcoming"),
    });

    if (isLoading) return <p className="p-4">Loading...</p>;
    if (error) return <p className="p-4 text-red-500">Error loading meetings</p>;
    if (error) return (
        <Card className="bg-white border shadow-sm">
            <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                    <Image
                        src="/images/empty_meeting.svg"
                        alt={`No upcoming meetings found.`}
                        width={200}
                        height={200}
                        className="w-32 h-32 mb-4 opacity-50"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming meetings found</h3>
                    <p className="p-4 text-red-500">Error loading meetings</p>;
                </div>
            </CardContent>
        </Card>
    );

    const upcoming_meetings = data?.data || [];

    // const upcoming_meetings: any[] = [];

    if (upcoming_meetings && upcoming_meetings.length === 0) {
        return (
            <Card className="bg-white border shadow-sm">
                <CardContent className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                        <Image
                            src="/images/empty_meeting.svg"
                            alt={`No upcoming meetings found.`}
                            width={200}
                            height={200}
                            className="w-32 h-32 mb-4 opacity-50"
                        />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming meetings found</h3>
                        <p className="text-gray-600">
                            You don't have any upcoming meetings scheduled.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-white border shadow-sm">
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
                {upcoming_meetings.map((meeting: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="font-medium text-sm text-gray-900 mb-1">{meeting.event.title}</div>
                        <div className="text-xs text-gray-600 mb-2">{formatMeetingTime(meeting.start_time)}</div>
                        <div className="flex -space-x-1">
                            <Avatar className="w-6 h-6 border-2 border-white">
                                <AvatarFallback className="text-xs bg-blue-100 text-blue-700">{meeting.name[0]}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
const RecentActivity = () => {
    return (
        <Card className="bg-white border shadow-sm">
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
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${event.status === "completed" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                                        }`}
                                >
                                    {event.status === "completed" ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
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
    )
}
const DashboardPage = () => {
    const [locationOrigin, setLocationOrigin] = useState<string>("");
    const [isEditing, setIsEditing] = useState(false);
    const { isLoaded, user } = useUser();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(usernameSchema),
        defaultValues: {
            username: "",
        },
    })

    const currentUsername = watch("username");
    // const { loading, error, fn: fnUpdateUsername } = useFetch(updateUsername);
    const { data, loading, error, fn } = useFetchs("/api/user", { method: "POST" });
    useEffect(() => {
        if (typeof window !== "undefined" && isLoaded && user) {
            setLocationOrigin(window.location.origin);
            setValue("username", user.username || "");
        }
    }, [isLoaded, user, setValue]);

    const onSubmit = async (data: { username: string }) => {
        try {
            const response = await fn({ username: data.username });
            if (response.success) {
                toast.success("Username updated successfully!");
                setIsEditing(false);
            } else {
                toast.error(response.error?.message || "Failed to update username");
            }
        } catch (err) {
            toast.error("An unexpected error occurred");
        }
    }

    const copyLink = () => {
        const linkToCopy = `${locationOrigin}/${currentUsername || user?.username || ""}`
        navigator.clipboard.writeText(linkToCopy)
        toast.success("Link copied to clipboard!")
    }

    const handleCancel = () => {
        setValue("username", user?.username || "")
        setIsEditing(false)
    }

    const currentDate = useMemo(() => {
        return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }, [])

    if (!isLoaded) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section - Simplified for mobile */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 md:p-8 text-white">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 md:w-16 md:h-16 ring-2 ring-white/20">
                            <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.firstName ?? ""} />
                            <AvatarFallback className="bg-white/20 text-white text-xl">{user?.firstName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {user?.firstName}!</h1>
                            <p className="text-blue-100 text-sm md:text-base">Ready to manage your schedule efficiently?</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-blue-100 mb-1">Today</div>
                        <div className="text-xl md:text-2xl font-bold">{currentDate}</div>
                    </div>
                </div>
            </div>

            {/* Stats Cards - Simplified styling for mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card className="bg-white border shadow-sm">
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
                                <p className="text-sm font-medium text-gray-600">This Week</p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">8</p>
                                <p className="text-xs text-blue-600 flex items-center mt-1">
                                    <Clock className="w-3 h-3 mr-1" />3 today
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-xl flex items-center justify-center">
                                <Video className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border shadow-sm">
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
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border shadow-sm">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">94%</p>
                                <Progress value={94} className="mt-2 h-2" />
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-xl flex items-center justify-center">
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
                    <Card className="bg-white border shadow-sm h-full">
                        <CardHeader className="p-4 md:p-6">
                            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <Settings className="w-4 h-4 text-white" />
                                </div>
                                Your Unique Link
                            </CardTitle>
                            <CardDescription className="text-sm">
                                Share this link to let others book meetings with you
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 md:p-6 pt-0 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm text-gray-600 mb-1">Your booking URL</div>
                                    <div className="font-mono text-sm bg-white px-3 py-2 rounded-lg border break-all">
                                        {locationOrigin}/{currentUsername || user?.username || ""}
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={copyLink}
                                    className="mt-6 shrink-0 bg-transparent cursor-pointer"
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Username</label>
                                {isEditing ? (
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <Input
                                                    {...register("username")}
                                                    className={`${errors.username ? "border-red-500" : ""}`}
                                                    placeholder="Enter username"
                                                />
                                                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                                            </div>
                                            <Button type="submit" size="sm" disabled={loading} className="cursor-pointer shrink-0">
                                                {loading ? "Saving..." : "Save"}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleCancel}
                                                disabled={loading}
                                                className="cursor-pointer shrink-0 bg-transparent"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                        {error && <p className="text-red-500 text-xs">{error.message}</p>}
                                    </form>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="font-mono text-sm bg-white px-3 py-2 rounded-lg border flex-1">
                                            {user?.username || "No username set"}
                                        </div>
                                        <Button className="cursor-pointer" variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                            <Edit3 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Upcoming Meetings with Suspense */}
                <Suspense fallback={<UpcomingMeetingsSkeleton />}>
                    <UpcomingMeetings />
                </Suspense>
            </div>

            {/* Recent Activity with Suspense */}
            <Suspense fallback={<RecentActivitySkeleton />}>
                <RecentActivity />
            </Suspense>
        </div>
    )
}

export default DashboardPage;
