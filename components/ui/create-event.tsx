'use client';

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "./button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Input } from "./input";
import { eventSchema } from "@/lib/utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { toast } from "sonner";
import { useCreateEvent, useEventById, useUpdateUserEvent } from "@/lib/api/event.api";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "./card";
import { Skeleton } from "./skeleton";

const CreateEventDrawer = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();

    const isEditMode = searchParams.get('edit') === 'true';
    const eventId = searchParams.get('id');

    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            duration: 30,
            is_private: true
        }
    });

    const { data: event, isLoading } = useEventById(eventId ?? "");
    const { mutateAsync: createEvent, isPending: isCreating } = useCreateEvent();
    const { mutateAsync: updateEvent, isPending: isUpdating } = useUpdateUserEvent();

    useEffect(() => {
        const create = searchParams.get("create");
        const edit = searchParams.get("edit");

        if (create == "true" || edit === "true") {
            setIsOpen(true);
        }

        if (edit === "true" && event) {
            // (async () => {
            //     try {
            //         const res = await getOwnedEventDetails(eventId);
            //         if (res && "data" in res && res.data) {
            //             reset({
            //                 title: res.data.title,
            //                 description: res.data.description ?? "",
            //                 duration: res.data.duration,
            //                 is_private: res.data.is_private,
            //             });
            //         }
            //     } catch (err) {
            //         console.error("Failed to fetch event", err);
            //     }
            // })();
            reset({
                title: event.title,
                description: event.description ?? "",
                duration: event.duration,
                is_private: event.is_private,
            });
        }
    }, [searchParams, eventId, event, reset]);

    const handleClose = () => {
        setIsOpen(false);
        const params = new URLSearchParams(window.location.search);

        ['create', 'edit', 'id'].forEach(key => params.delete(key));

        const newQuery = params.toString();
        router.replace(`/events${newQuery ? `?${newQuery}` : ''}`);
    }

    const onSubmit = useCallback(async (data: typeof eventSchema._type) => {
        try {
            // const res = isEditMode ? await updateEvent(eventId, data) : await createEvent(data);
            if (isEditMode) {
                if (!eventId) throw new Error("Event ID is missing for update.");
                // const res = await updateEvent(eventId, data);
                const res = await updateEvent({
                    eventId: eventId,
                    payload: data,
                });
            } else {
                const res = await createEvent(data);
            }
            toast.success(isEditMode ? "Event updated successfully" : "Event created successfully");
            // invalidate events list cache if there's any
            queryClient.invalidateQueries({ queryKey: ['events'] });
            reset();
            handleClose();
        } catch (err: any) {
            toast.error(err.message || "An unexpected error occurred:");
        }
    }, [createEvent, updateEvent, isEditMode, reset, handleClose, queryClient]);

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => {
                setIsOpen(open)
                if (!open) handleClose();
            }}>
                <div className='flex flex-col gap-4'>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{isEditMode ? 'Update Event' : 'Create New Event'}</DialogTitle>
                            <DialogDescription>
                                {isEditMode ? `Update the event details below. Click save when you&apos;re done.` : `Fill out the details below to create a new event. Click save when you&apos;re done.`}
                            </DialogDescription>
                        </DialogHeader>
                        {isLoading ? <FormLoading /> :
                            <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                    <label htmlFor="title" className='block text-sm font-medium text-gray-700'>Event Title</label>
                                    <Input id='title' {...register("title")} className='mt-1' />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="description" className='block text-sm font-medium text-gray-700'>Event description</label>
                                    <Input id='description' {...register("description")} className='mt-1' />
                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="description" className='block text-sm font-medium text-gray-700'>Duration (minutes)</label>
                                    <Input id='duration' {...register("duration", {
                                        valueAsNumber: true
                                    })} type='number' className='mt-1' />
                                    {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="is_private" className='block text-sm font-medium text-gray-700'>Event Privacy</label>
                                    <Controller
                                        name='is_private'
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value ? "true" : "false"}
                                                onValueChange={val => field.onChange(val === "true")}
                                            >
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
                                {/* {error && <p className="text-red-500 text-sm mt-1"> {typeof error === "object" && error !== null && "message" in error
                                ? (error as { message: string }).message
                                : String(error)}</p>} */}
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button onClick={handleClose} variant="outline" className="cursor-pointer">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={isCreating || isUpdating} className='bg-blue-600 cursor-pointer hover:bg-blue-600'> {isCreating ? "Submitting..." :  isUpdating ? 'Updating...' : isEditMode ? "Update Event" : "Create Event"}</Button>
                                </DialogFooter>
                            </form>
                        }
                    </DialogContent>
                </div>
            </Dialog>
        </>
    )
}


// Loading skeleton for event list
const FormLoading = () => (
    <div className="flex flex-col">
        <Card className="bg-white border shadow-sm">
            <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    </div>
)

export default CreateEventDrawer;
