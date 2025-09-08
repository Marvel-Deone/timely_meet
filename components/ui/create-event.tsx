"use client"

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "./button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./dialog"
import { Input } from "./input";
import { eventSchema } from "@/lib/utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { toast } from "sonner";
import { useCreateEvent, useEventById, useUpdateUserEvent, useUserEvents } from "@/lib/api/event.api";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "./card";
import { Skeleton } from "./skeleton";
import { Badge } from "./badge";
import { Calendar, Users, Vote, RotateCcw, UserCheck, ArrowLeft, ArrowRight } from "lucide-react";
import { Textarea } from "./textarea";

type EventType = "ONE_ON_ONE" | "GROUP" | "POLL" | "ROUND_ROBIN" | "COLLECTIVE";

interface PollOption {
    id: string
    start_time: string
    end_time: string
}

// interface ExtendedEventData {
//   title: string
//   description?: string
//   duration: number
//   is_private: boolean
//   event_type: EventType
//   capacity?: number
//   poll_options?: PollOption[]
// }

const eventTypes = [
    {
        type: "ONE_ON_ONE" as EventType,
        label: "One-on-One",
        description: "Direct meeting between two people",
        icon: UserCheck,
        features: ["No capacity limit", "Direct scheduling"],
    },
    {
        type: "GROUP" as EventType,
        label: "Group Event",
        description: "Meeting with multiple participants",
        icon: Users,
        features: ["Set capacity", "Multiple attendees"],
    },
    {
        type: "POLL" as EventType,
        label: "Poll Event",
        description: "Let attendees vote on preferred times",
        icon: Vote,
        features: ["Multiple time options", "Voting system"],
    },
    {
        type: "ROUND_ROBIN" as EventType,
        label: "Round Robin",
        description: "Sequential meetings with participants",
        icon: RotateCcw,
        features: ["Rotating schedule", "Set capacity"],
    },
    {
        type: "COLLECTIVE" as EventType,
        label: "Collective",
        description: "Large group collaborative event",
        icon: Calendar,
        features: ["High capacity", "Collaborative"],
    },
]

const CreateEventDrawer = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedEventType, setSelectedEventType] = useState<EventType>("ONE_ON_ONE");
    const [pollOptions, setPollOptions] = useState<PollOption[]>([]);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const totalSteps = 3; // Event Type, Details, Configuration

    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();

    const isEditMode = searchParams.get("edit") === "true";
    const eventId = searchParams.get("id");

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        watch,
        trigger,
        getValues,
    } = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            duration: 30,
            is_private: true,
            type: "ONE_ON_ONE",
            capacity: null,
        },
    })

    const { data: event, isLoading } = useEventById(eventId ?? "")
    const { mutateAsync: createEvent, isPending: isCreating } = useCreateEvent()
    const { mutateAsync: updateEvent, isPending: isUpdating } = useUpdateUserEvent()
    const { data: events, refetch } = useUserEvents()

    const addPollOption = () => {
        const now = new Date()
        const startTime = new Date(now.getTime() + (pollOptions.length + 1) * 24 * 60 * 60 * 1000)
        const endTime = new Date(startTime.getTime() + watch("duration") * 60 * 1000)

        const newOption: PollOption = {
            id: `option-${Date.now()}`,
            start_time: startTime.toISOString().slice(0, 16),
            end_time: endTime.toISOString().slice(0, 16),
        }

        setPollOptions([...pollOptions, newOption])
    }

    const removePollOption = (id: string) => {
        setPollOptions(pollOptions.filter((option) => option.id !== id))
    }

    const updatePollOption = (id: string, field: "start_time" | "end_time", value: string) => {
        setPollOptions(pollOptions.map((option) => (option.id === id ? { ...option, [field]: value } : option)))
    }

    const handleClose = () => {
        setIsOpen(false)
        setSelectedEventType("ONE_ON_ONE")
        setPollOptions([])
        setCurrentStep(1)
        const params = new URLSearchParams(window.location.search);
        ["create", "edit", "id"].forEach((key) => params.delete(key))

        const newQuery = params.toString()
        router.replace(`/events${newQuery ? `?${newQuery}` : ""}`)
    }

    const nextStep = async () => {
        if (currentStep === 1) {
            setCurrentStep(2);
        } else if (currentStep === 2) {
            const isValid = await trigger(["title", "description", "duration", "is_private"]);
            if (isValid) {
                setCurrentStep(3);
            }
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    // const values = getValues();
    const values = watch();
    const canProceedToNext = () => {
        if (currentStep === 1) return true;
        if (currentStep === 2) {
            // console.log('dddd', values);
            // return values.title && values.title.trim().length > 0
            //  return Object.keys(errors).length === 0; // only proceed if no validation errors
            return (
                values.title?.trim().length > 0 &&
                // values.description?.trim().length > 0 &&
                values.duration > 0 &&
                typeof values.is_private === "boolean"
            )
        }
        if (currentStep === 3) {
            if (selectedEventType === "POLL") {
                return pollOptions.length >= 2
            }
            return true
        }
        return false
    }

    const getStepTitle = () => {
        switch (currentStep) {
            case 1:
                return "Choose Event Type"
            case 2:
                return "Event Details"
            case 3:
                return "Configuration"
            default:
                return "Create Event"
        }
    }

    const onSubmit = useCallback(
        async (data: typeof eventSchema._type) => {
            // const eventValues = getValues();
            console.log( 'data', data, 'Form submitted', values);

            try {
                const eventData = {
                    ...data,
                    type: selectedEventType,
                    poll_options: selectedEventType === "POLL" ? pollOptions : undefined,
                }

                if (isEditMode) {
                    if (!eventId) throw new Error("Event ID is missing for update.")
                    await updateEvent({
                        eventId: eventId,
                        payload: eventData,
                    })
                } else {
                    const res = await createEvent(eventData);
                    console.log('redgg:', res);
                }
                toast.success(isEditMode ? "Event updated successfully" : "Event created successfully")
                reset()
                handleClose()
            } catch (err: any) {
                console.log("errvvv:", err)
                toast.error(err.message || "An unexpected error occurred:")
            }
        },
        [createEvent, updateEvent, isEditMode, reset, queryClient, selectedEventType, pollOptions],
    )

    useEffect(() => {
        const create = searchParams.get("create")
        const edit = searchParams.get("edit")

        if (create == "true" || edit === "true") {
            setIsOpen(true)
        }

        if (edit === "true" && event) {
            reset({
                title: event.title,
                description: event.description ?? "",
                duration: event.duration,
                is_private: event.is_private,
                type: event.type || "ONE_ON_ONE",
                capacity: event.capacity,
            })
            setSelectedEventType(event.type || "ONE_ON_ONE")
            if (event.poll_options) {
                setPollOptions(event.poll_options)
            }
            setCurrentStep(2)
        }
    }, [searchParams, eventId, event, reset])

    const renderEventTypeStep = () => (
        <div>
            <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">What type of event would you like to create?</h3>
                <p className="text-sm text-gray-600 mt-1">Choose the format that best fits your needs</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {eventTypes.map((eventType) => {
                    const Icon = eventType.icon
                    return (
                        <Card
                            key={eventType.type}
                            className={`cursor-pointer transition-all hover:shadow-md ${selectedEventType === eventType.type ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                                }`}
                            onClick={() => setSelectedEventType(eventType.type)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                    <Icon className="h-6 w-6 text-blue-600 mt-1" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-base">{eventType.label}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{eventType.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {eventType.features.map((feature) => (
                                                <Badge key={feature} variant="secondary" className="text-xs">
                                                    {feature}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )

    const renderDetailsStep = () => (
        <div className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Event Title
                </label>
                <Input id="title" {...register("title")} className="mt-1" placeholder="Enter event title" />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Event Description
                </label>
                <Textarea
                    id="description"
                    {...register("description")}
                    className="mt-1"
                    rows={3}
                    placeholder="Describe your event (optional)"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Duration (minutes)
                </label>
                <Input
                    id="duration"
                    {...register("duration", {
                        valueAsNumber: true,
                    })}
                    type="number"
                    className="mt-1"
                    placeholder="30"
                />
                {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
            </div>

            <div>
                <label htmlFor="is_private" className="block text-sm font-medium text-gray-700">
                    Event Privacy
                </label>
                <Controller
                    name="is_private"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value ? "true" : "false"} onValueChange={(val) => field.onChange(val === "true")}>
                            <SelectTrigger className="mt-1 w-full">
                                <SelectValue placeholder="Select Privacy" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Private</SelectItem>
                                <SelectItem value="false">Public</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.is_private && <p className="text-red-500 text-sm mt-1">{errors.is_private.message}</p>}
            </div>
        </div>
    )

    const renderConfigurationStep = () => (
        <div className="space-y-6">
            {selectedEventType !== "ONE_ON_ONE" && (
                <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                        Event Capacity
                    </label>
                    <Controller
                        name="capacity"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value?.toString() || "unlimited"}
                                onValueChange={(val) => field.onChange(val === "unlimited" ? undefined : Number.parseInt(val))}
                            >
                                <SelectTrigger className="mt-1 w-full">
                                    <SelectValue placeholder="Select capacity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unlimited">Unlimited</SelectItem>
                                    <SelectItem value="5">5 people</SelectItem>
                                    <SelectItem value="10">10 people</SelectItem>
                                    <SelectItem value="25">25 people</SelectItem>
                                    <SelectItem value="50">50 people</SelectItem>
                                    <SelectItem value="100">100 people</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {selectedEventType === "GROUP" && "Set the maximum number of participants for your group event."}
                        {selectedEventType === "POLL" && "Maximum number of people who can vote and attend."}
                        {selectedEventType === "ROUND_ROBIN" && "Number of participants in the rotation."}
                        {selectedEventType === "COLLECTIVE" && "Maximum attendees for your collaborative event."}
                    </p>
                </div>
            )}

            {selectedEventType === "POLL" && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">Time Options</label>
                        <Button type="button" variant="outline" size="sm" onClick={addPollOption}>
                            Add Option
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                        Add multiple time slots for attendees to vote on. At least 2 options are required.
                    </p>

                    {pollOptions.length === 0 ? (
                        <Card className="p-4 text-center text-gray-500">
                            <p className="text-sm">No time options added yet.</p>
                            <Button type="button" variant="outline" size="sm" className="mt-2 bg-transparent" onClick={addPollOption}>
                                Add First Option
                            </Button>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {pollOptions.map((option, index) => (
                                <Card key={option.id} className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs text-gray-500">Start Time</label>
                                                <Input
                                                    type="datetime-local"
                                                    value={option.start_time}
                                                    onChange={(e) => updatePollOption(option.id, "start_time", e.target.value)}
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">End Time</label>
                                                <Input
                                                    type="datetime-local"
                                                    value={option.end_time}
                                                    onChange={(e) => updatePollOption(option.id, "end_time", e.target.value)}
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removePollOption(option.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {selectedEventType === "POLL" && pollOptions.length < 2 && (
                        <p className="text-red-500 text-sm mt-2">At least 2 time options are required for poll events.</p>
                    )}
                </div>
            )}

            {selectedEventType === "ONE_ON_ONE" && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-3">
                        <UserCheck className="h-5 w-5 text-blue-600" />
                        <div>
                            <h4 className="font-medium text-blue-900">One-on-One Event</h4>
                            <p className="text-sm text-blue-700">
                                This event type is ready to go! No additional configuration needed.
                            </p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )

    return (
        <>
            <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                    setIsOpen(open)
                    if (!open) handleClose()
                }}
            >
                <div className="flex flex-col gap-4">
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {isEditMode ? "Update Event" : "Create New Event"} - {getStepTitle()}
                            </DialogTitle>
                            <DialogDescription asChild>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-gray-500">
                                        Step {currentStep} of {totalSteps}
                                    </span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-1">
                                        <div
                                            className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                        {isLoading ? (
                            <FormLoading />
                        ) : (
                            <>
                                <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                                    {currentStep === 1 && renderEventTypeStep()}
                                    {currentStep === 2 && renderDetailsStep()}
                                    {currentStep === 3 && renderConfigurationStep()}
                                </form>

                                <DialogFooter className="flex justify-between">
                                    <div className="flex gap-2">
                                        <DialogClose asChild>
                                            <Button onClick={handleClose} variant="outline" className="cursor-pointer bg-transparent">
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        {currentStep > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={prevStep}
                                                className="cursor-pointer bg-transparent"
                                            >
                                                <ArrowLeft className="h-4 w-4 mr-1" />
                                                Back
                                            </Button>
                                        )}
                                    </div>

                                    <div>
                                        {currentStep < totalSteps ? (
                                            <Button
                                                type="button"
                                                onClick={nextStep}
                                                disabled={!canProceedToNext()}
                                                className="bg-blue-600 cursor-pointer hover:bg-blue-700"
                                            >
                                                Next
                                                <ArrowRight className="h-4 w-4 ml-1" />
                                            </Button>
                                        ) : (
                                            <Button
                                                type="submit" onClick={handleSubmit(onSubmit)}
                                                disabled={isCreating || isUpdating || (selectedEventType === "POLL" && pollOptions.length < 2)}
                                                className="bg-blue-600 cursor-pointer hover:bg-blue-600"
                                            >
                                                {isCreating
                                                    ? "Submitting..."
                                                    : isUpdating
                                                        ? "Updating..."
                                                        : isEditMode
                                                            ? "Update Event"
                                                            : "Create Event"}
                                            </Button>
                                        )}
                                    </div>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </div>
            </Dialog>
        </>
    )
}

const FormLoading = () => (
    <Card className="bg-white border shadow-sm">
        <Skeleton className="h-[125px] w-full rounded-xl bg-gray-100" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-gray-100" />
            <Skeleton className="h-4 w-[60%] bg-gray-100" />
        </div>
    </Card>
)

export default CreateEventDrawer
