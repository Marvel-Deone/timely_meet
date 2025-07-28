"use client"

import React, { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Clock, Users, Link, Trash2, MoreVertical, Eye, Edit, Globe, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Event } from "@/lib/types/event.types";
import useFetch from "@/hooks/use-fetch";
import { deleteUserEvent } from "@/actions/event";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { generateEventColor, getColorClasses } from "@/lib/common";

interface EventCardProps {
    event: Event
    username: string
    is_public: boolean
    onEventDeleted?: () => void
}

const EventCard = React.memo<EventCardProps>(({ event, username, is_public, onEventDeleted }) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const router = useRouter();

    const { loading: deleteLoading, fn: fnDeleteEvent } = useFetch(deleteUserEvent)

    const eventUrl = useMemo(() => `${username}/${event.id}`, [username, event.id])
    const publicEventUrl = useMemo(() => `${window.location.origin}/${username}/${event.id}`, [event.id])
    const colorClasses = useMemo(() => getColorClasses(generateEventColor(event)), [event])
    const bookingCount = useMemo(() => event._count?.bookings || 0, [event._count?.bookings])
    const isActive = useMemo(() => bookingCount > 0, [bookingCount])

    const handleCardClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const target = e.target as HTMLElement
            const isInteractiveElement =
                ["BUTTON", "SVG", "PATH"].includes(target.tagName) ||
                target.closest("button") ||
                target.closest('[role="menuitem"]')

            if (!isInteractiveElement) {
                window.open(eventUrl, "_blank")
            }
        },
        [eventUrl],
    )

    const handleCopyLink = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation()
            navigator.clipboard.writeText(publicEventUrl)
            toast.success("Event link copied to clipboard!")
        },
        [publicEventUrl],
    )

    const handleViewDetails = useCallback(() => {
        window.open(eventUrl, "_blank")
    }, [eventUrl])

    const handleEditEvent = useCallback(() => {
        router.push(`/events?edit=true&id=${event.id}`);
    }, [router, event.id]);

    const handleDeleteClick = useCallback(() => {
        setIsDeleteDialogOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        try {
            const res = await fnDeleteEvent(event.id)
            if (res?.success) {
                toast.success("Event deleted successfully!");
                onEventDeleted?.();
            } else {
                toast.error(res?.error?.message || "Failed to delete event.")
            }
        } catch (err) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsDeleteDialogOpen(false);
        }
    }, [fnDeleteEvent, event.id, onEventDeleted]);

    const avatarComponents = useMemo(() => {
        if (bookingCount === 0) return null

        const avatarsToShow = Math.min(bookingCount, 3)
        const remainingCount = bookingCount - 3

        return (
            <div className="flex -space-x-1">
                {Array.from({ length: avatarsToShow }).map((_, i) => (
                    <Avatar key={i} className="w-6 h-6 border-2 border-white">
                        <AvatarFallback className="text-xs bg-gray-100">{String.fromCharCode(65 + i)}</AvatarFallback>
                    </Avatar>
                ))}
                {remainingCount > 0 && (
                    <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                        +{remainingCount}
                    </div>
                )}
            </div>
        )
    }, [bookingCount]);

    return (
        <>
            <Card
                className="cursor-pointer group hover:shadow-lg transition-all duration-200 border-0 bg-white/60 backdrop-blur-sm"
                onClick={handleCardClick}
            >
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colorClasses} flex-shrink-0 mt-1`} />
                            <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg font-semibold text-gray-900 break-words leading-tight">{event.title}</CardTitle>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <Clock className="w-4 h-4" />
                                        {event.duration} mins
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        {!event.is_private ? (
                                            <>
                                                <Globe className="w-4 h-4" />
                                                Public
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-4 h-4" />
                                                Private
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {!is_public && <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleViewDetails} className="cursor-pointer">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleEditEvent} className="cursor-pointer">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Event
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleDeleteClick} disabled={deleteLoading}>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Event
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>}
                    </div>
                </CardHeader>

                <CardContent className="pt-0">
                    <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</CardDescription>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Users className="w-4 h-4" />
                                <span className="font-medium">{bookingCount}</span>
                                <span>booking{bookingCount !== 1 ? "s" : ""}</span>
                            </div>
                            {avatarComponents}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={handleCopyLink} className="bg-transparent cursor-pointer">
                                <Link className="w-4 h-4" />
                            </Button>
                            <Badge variant={isActive ? "default" : "secondary"} className="capitalize">
                                {isActive ? "Active" : "No bookings"}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Event</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{event.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                        <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleteLoading} className="cursor-pointer">
                            {deleteLoading ? "Deleting..." : "Delete"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
})

EventCard.displayName = "EventCard";

export default EventCard;
