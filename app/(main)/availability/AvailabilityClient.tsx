"use client";

import AvailabilityForm from "./_components/availability-form";
import { defaultAvailability } from "@/lib/const/availability.data";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Clock, Calendar, Settings } from "lucide-react";
import { useAvailability } from "@/lib/api/availability.api";

export default function AvailabilityClient() {
    const { data: availability, isLoading, isError } = useAvailability();

    if (isLoading) {
        return <p className="text-gray-600">Loading availability...</p>;
    }

    if (isError) {
        return <p className="text-red-600">Failed to load availability.</p>;
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Availability
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Set your weekly schedule and booking preferences
                    </p>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <Card className="bg-white border shadow-sm">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Weekly Schedule
                                </p>
                                <p className="text-lg font-bold text-gray-900">Set Your Hours</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border shadow-sm">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Booking Buffer
                                </p>
                                <p className="text-lg font-bold text-gray-900">Time Gap</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border shadow-sm">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                                <Settings className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Auto Updates</p>
                                <p className="text-lg font-bold text-gray-900">Live Sync</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Form */}
            <Card className="bg-white border shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" /> Weekly Availability
                    </CardTitle>
                    <CardDescription>
                        Select the days and times when you're available for meetings. Changes
                        are saved automatically.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AvailabilityForm initialData={availability || defaultAvailability} />
                </CardContent>
            </Card>
        </div>
    );
}
