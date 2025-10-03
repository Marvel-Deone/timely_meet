"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Clock, CheckCircle, AlertCircle, ArrowLeft, Calendar, Trophy } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useFinalizeEventTime, usePollEventById } from "@/lib/api/event.api"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PollOption {
    id: string
    start_time: string
    end_time: string
    votes: Array<{
        id: string,
        voter_name: string,
        voter_email: string,
        user: {
            id: string
            name: string
            email: string
            avatar?: string
        }
    }>
}

interface PollEvent {
    id: string
    title: string
    description?: string
    status: "pending" | "finalized"
    capacity?: number
    created_at: string
    poll_options: PollOption[]
    finalizedTime?: string
}

interface Option {
    start_time: '',
    end_time: '',
    votes: {},
    event_id: ''
}

const PollResultsPage = () => {
    const params = useParams();

    let pollEvent: PollEvent | null = null;
    const eventId = params.id ? params.id.toString() : "";
    const { data, isLoading, error } = usePollEventById(eventId);
    const [confirming, setConfirming] = useState(false);
    const [isFinalizeDialogOpen, setIsFinalizeDialogOpen] = useState(false);
    pollEvent = data ?? null;
    const [finalOption, setFinalOption] = useState<PollOption | null>(null);
    // const { mutateAsync: finalizeEventTime, isPending, data: finalizeData } = useFinalizeEventTime(eventId)
    const handleFinalTimeClick = (option: PollOption) => {
        if (!pollEvent) return;
        setFinalOption(option);
        setIsFinalizeDialogOpen(true);
    };
    const { mutateAsync: finalizeEventTime, isPending, data: finalizeData } = useFinalizeEventTime();
    const handleConfirmFinalTime = async () => {
        const finalize_data = {
            eventId: eventId,
            chosenOptionId: finalOption?.id
        }
        try {
            const res = await finalizeEventTime(finalize_data);
        } catch (err: any) {
            console.error("Failed to finalize poll:", error)
            toast.error(err.message || "Failed to finalize poll")
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        )
    }

    if (!pollEvent) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Poll event not found</h3>
                        <Link href="/polls">
                            <Button variant="outline">Back to Polls</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const totalVotes = pollEvent.poll_options.reduce((sum, option) => sum + option.votes.length, 0)
    const mostPopularOption = pollEvent.poll_options.reduce((prev, current) =>
        prev.votes.length > current.votes.length ? prev : current,
    )

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/polls">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Polls
                    </Button>
                </Link>
            </div>

            {pollEvent && <div className="space-y-6">
                {/* Event Header */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-2xl mb-2">{pollEvent.title}</CardTitle>
                                {pollEvent.description && <p className="text-muted-foreground">{pollEvent.description}</p>}
                            </div>
                            <Badge variant={pollEvent.status === "finalized" ? "default" : "secondary"} className="shrink-0">
                                {pollEvent.status === "finalized" ? (
                                    <>
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Finalized
                                    </>
                                ) : (
                                    <>
                                        <Clock className="w-3 h-3 mr-1" />
                                        Pending Selection
                                    </>
                                )}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{totalVotes} total votes</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{pollEvent.poll_options.length} time options</span>
                            </div>
                            {pollEvent.capacity && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Max {pollEvent.capacity} attendees</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Poll Results */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Voting Results</h2>

                    {pollEvent.poll_options
                        .sort((a, b) => b.votes.length - a.votes.length)
                        .map((option, index) => (
                            <Card
                                key={option.id}
                                className={`${option.id === mostPopularOption.id && pollEvent.status === "pending"
                                    ? "ring-2 ring-primary/20 bg-primary/5"
                                    : ""
                                    }`}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {index === 0 && pollEvent.status === "pending" && <Trophy className="w-5 h-5 text-yellow-500" />}
                                            <div>
                                                <div className="font-medium">
                                                    {new Date(option.start_time).toLocaleDateString("en-US", {
                                                        weekday: "long",
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(option.start_time).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}{" "}
                                                    -{" "}
                                                    {new Date(option.end_time).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-sm">
                                            {option.votes.length} votes
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    {option.votes.length > 0 ? (
                                        <div className="space-y-3">
                                            <div className="text-sm font-medium text-muted-foreground">Voters ({option.votes.length}):</div>
                                            <div className="flex flex-wrap gap-2">
                                                {option.votes.map((vote) => (
                                                    <div key={vote.id} className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1">
                                                        <Avatar className="w-5 h-5">
                                                            <AvatarImage src="/images/default_avatar.png" />
                                                            <AvatarFallback className="text-xs">
                                                                {vote.voter_name.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm">{vote.voter_name}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {pollEvent.status === "pending" && index === 0 && (
                                                <div className="pt-3 border-t">
                                                    <Button
                                                        onClick={() => handleFinalTimeClick(option)}
                                                        disabled={confirming}
                                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                                                    >
                                                        {confirming ? "Confirming..." : "Confirm Final Time"}
                                                    </Button>
                                                    <p className="text-xs text-muted-foreground mt-2 text-center">
                                                        This will finalize the event and notify all voters
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No votes yet</p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                </div>

                {pollEvent.status === "finalized" && pollEvent.finalizedTime && (
                    <Card className="border-green-200 bg-green-50">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <div>
                                    <div className="font-medium text-green-900">Event Finalized</div>
                                    <div className="text-sm text-green-700">Final time confirmed and attendees have been notified</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>}

            {/* Finalize Confirmation Dialog */}
            <AlertDialog open={isFinalizeDialogOpen} onOpenChange={setIsFinalizeDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Finalize Event Day & Time</AlertDialogTitle>
                        {finalOption && <AlertDialogDescription>
                            Are you sure you want to finalize the event for "  {new Date(finalOption.start_time).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}, from {new Date(finalOption.start_time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}{" "}
                            to {" "}
                            {new Date(finalOption.end_time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}"? This action cannot be undone.
                        </AlertDialogDescription>}
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                        <Button variant="default" onClick={handleConfirmFinalTime} className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                            {isPending ? "Finalizing..." : "Finalize"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default PollResultsPage;
