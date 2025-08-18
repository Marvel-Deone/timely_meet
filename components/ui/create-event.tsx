'use client';

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "./button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Input } from "./input";
import useFetch from "@/hooks/use-fetch";
import { createEvent, getOwnedEventDetails, updateUserEvent } from "@/actions/event";
import { eventSchema } from "@/lib/utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { toast } from "sonner";
import { useEventContext } from "@/context/EventContext";

const CreateEventDrawer = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refetchEvents } = useEventContext();
    const isEditMode = searchParams.get('edit') === 'true';

    const eventId = searchParams.get('id');

    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            duration: 30,
            is_private: true
        }
    });
    const { loading, error, fn } = useFetch(async (data) => {
        if (isEditMode && eventId) {
            return await updateUserEvent(eventId, data);
        }
        return await createEvent(data);
    });
    // const { loading, error, fn: fnEditEvent } = useFetch(editEvent);

    useEffect(() => {
        const create = searchParams.get("create");
        const edit = searchParams.get("edit");

        if (create == "true" || edit === "true") {
            setIsOpen(true);
        }

        if (edit === "true" && eventId) {
            (async () => {
                try {
                    const res = await getOwnedEventDetails(eventId);
                    if (res && "data" in res) {
                        reset({
                            title: res.data.title,
                            description: res.data.description ?? "",
                            duration: res.data.duration,
                            is_private: res.data.is_private,
                        });
                    }
                } catch (err) {
                    console.error("Failed to fetch event", err);
                }
            })();
        }
    }, [searchParams, eventId, reset]);

    const handleClose = () => {
        setIsOpen(false);
        const params = new URLSearchParams(window.location.search);

        ['create', 'edit', 'id'].forEach(key => params.delete(key));

        const newQuery = params.toString();
        router.replace(`/events${newQuery ? `?${newQuery}` : ''}`);
    }

    const onSubmit = useCallback(async (data: typeof eventSchema._type) => {
        try {
            const res = await fn(data);
            if (res?.success) {
                toast.success(isEditMode ? "Event updated successfully" : "Event created successfully");
                refetchEvents(true);
                reset();
                handleClose();
            } else {
                toast.error(res?.error?.message || (isEditMode ? "Failed to update event." : "Failed to create event."));
            }
        } catch (err) {
            toast.error("An unexpected error occurred");
        }
    }, [fn, refetchEvents, isEditMode, reset, handleClose]);

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
                            {error && <p className="text-red-500 text-sm mt-1"> {typeof error === "object" && error !== null && "message" in error
                                ? (error as { message: string }).message
                                : String(error)}</p>}
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button onClick={handleClose} variant="outline" className="cursor-pointer">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={loading} className='bg-blue-600 cursor-pointer hover:bg-blue-600'> {loading ? "Submitting..." : isEditMode ? "Update Event" : "Create Event"}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </div>
            </Dialog>
        </>
    )
}

export default CreateEventDrawer;
