'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "./button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Label } from "./label";
import { Input } from "./input";
import useFetch from "@/hooks/use-fetch";
import { createEvent } from "@/actions/event";
import { eventSchema } from "@/app/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Toaster from "../dashboard/Toaster";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { AlertColor } from "@mui/material";

const CreateEventDrawer = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [toasterType, setToasterType] = useState<AlertColor>('success');

    const router = useRouter();
    const searchParams = useSearchParams();

    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            duration: 30,
            is_private: true
        }
    });
    const { loading, error, fn: fnCreateEvent } = useFetch(createEvent);

    const handleToasterClose = () => setOpen(false);

    useEffect(() => {
        const create = searchParams.get("create");

        if (create == "true") {
            setIsOpen(true);
        }
    }, [searchParams])

    const handleClose = () => {
        setIsOpen(false);
        if (searchParams.get("create") == "true") {
            router.replace(window?.location?.pathname);
        }
    }

    const onSubmit = async (data: typeof eventSchema._type) => {
        const result = await fnCreateEvent(data);
        setOpen(true);
        setToasterType(result.success ? 'success' : 'error');
        setMessage(
            result.success ? "Event Created Successfully" : result.error.message
        );
        if (!loading && !error) {
            reset();
            handleClose();
            router.refresh();
        }
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => {
                setIsOpen(open)
                if (!open) handleClose();
            }}>
                <div className='flex flex-col gap-4'>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New Event</DialogTitle>
                            <DialogDescription>
                                Fill out the details below to create a new event. Click save when you&apos;re done.
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
                                <Button type="submit" disabled={loading} className='bg-blue-600 cursor-pointer hover:bg-blue-600'>{loading ? "Submitting..." : "Create Event"}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </div>
            </Dialog>

            {/* Snackbar */}
            <Toaster
                open={open}
                message={message}
                type={toasterType}
                onClose={handleToasterClose}
            />
        </>
    )
}

export default CreateEventDrawer;
