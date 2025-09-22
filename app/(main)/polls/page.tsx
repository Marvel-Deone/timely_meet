"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useUserEvents } from "@/lib/api/event.api";

interface PollEvent {
    id: string
    title: string
    description?: string
    status: "pending" | "finalized"
    totalVotes: number
    capacity?: number
    created_at: string
    poll_options: Array<{
        id: string
        start_time: string
        end_time: string
        votes: number
    }>
}

const Polls = () => {
    // const [pollEvents, setPollEvents] = useState<PollEvent[]>([]);
    const [loading, setLoading] = useState(true);
    let pollEvents: PollEvent[] = [];

    const { data, isLoading, error } = useUserEvents({ type: "POLL" });
    pollEvents = data?.events ?? [];

    console.log('pollEvents:', pollEvents);
    if (isLoading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        )
    }
    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Poll Events</h1>
                    <p className="text-muted-foreground">Manage your poll events and view voting results</p>
                </div>
            </div>
            <div>
                {pollEvents && pollEvents.length == 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No poll events found</h3>
                            <p className="text-muted-foreground text-center">
                                Create your first poll event to get started with collecting votes from attendees.
                            </p>
                        </CardContent>
                    </Card>
                ) : <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {pollEvents.map((event) => (
                        <Card key={event.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                                    <Badge variant={event.status === "finalized" ? "default" : "secondary"} className="ml-2 shrink-0">
                                        {event.status === "finalized" ? (
                                            <>
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Finalized
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="w-3 h-3 mr-1" />
                                                Pending
                                            </>
                                        )}
                                    </Badge>
                                </div>
                                {event.description && <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>}
                            </CardHeader>

                            <CardContent className="pt-0">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{event.totalVotes} votes</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{event.poll_options.length} options</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="text-xs text-muted-foreground">Most popular option:</div>
                                    {event.poll_options.length > 0 && (
                                        <div className="text-sm bg-muted/50 rounded-md p-2">
                                            {(() => {
                                                const mostPopular = event.poll_options.reduce((prev, current) =>
                                                    prev.votes > current.votes ? prev : current,
                                                )
                                                return (
                                                    <div className="flex justify-between items-center">
                                                        <span>
                                                            {new Date(mostPopular.start_time).toLocaleDateString()} at{" "}
                                                            {new Date(mostPopular.start_time).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {mostPopular.votes} votes
                                                        </Badge>
                                                    </div>
                                                )
                                            })()}
                                        </div>
                                    )}
                                </div>

                                <Link href={`/dashboard/polls/${event.id}`}>
                                    <Button className="w-full bg-transparent" variant="outline">
                                        View Results
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>}
            </div>

        </div>
    )
}

export default Polls
