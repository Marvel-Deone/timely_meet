'use client';

import { updateUserAvailability } from "@/actions/availability";
import { availabilitySchema } from "@/app/lib/validators";
import Toaster from "@/components/dashboard/Toaster";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import useFetch from "@/hooks/use-fetch";
import { timeSlots } from "@/lib/consts/availability.data";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertColor } from "@mui/material";
import { Clock } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

type AvailabilityFormProps = {
    initialData: any
}

const AvailabilityForm = ({ initialData }: AvailabilityFormProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [toasterType, setToasterType] = useState<AlertColor>('success');
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const getDefaultValues = (initialData: any) => {
        const defaults: any = { time_gap: initialData?.time_gap ?? 0 };
        days.forEach((day) => {
            defaults[day] = {
                is_available: initialData?.[day]?.is_available ?? false,
                start_time: initialData?.[day].start_time ?? "09:00",
                end_time: initialData?.[day].end ?? "17:00",
            };
        });
        return defaults;
    }

    const defaultValues = getDefaultValues(initialData);
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(availabilitySchema),
        defaultValues,
    });

    const { fn: fnUpdateAvailability, loading, error } = useFetch(updateUserAvailability);
    
    const handleToasterClose = () => setOpen(false);

    const onSubmit = async (data: {}) => {
        const res = await fnUpdateAvailability(data);
        setOpen(true);
        setToasterType(res.success ? 'success' : 'error');
        setMessage(
            res.success ? ((res as { message?: string }).message) : res.error.message
        );
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="md:border md:rounded-xl md:p-6 w-full">
            {
                days.map((day) => {
                    const is_available = watch(`${day}.is_available`);
                    return (
                        <div key={day} className="flex flex-col md:flex-row items-center gap-3 px-4 py-3 mb-3 border border-gray-300 rounded-xl">
                            <div className="flex items-center space-x-4 md:w-40">
                                <Controller name={`${day}.is_available`} control={control} render={({ field }) => {
                                    return <Checkbox className="w-[21px] h-[21px] checkbox-label rounded-[6px] hover:bg-gray-200 cursor-pointer" checked={field.value} onCheckedChange={(checked) => {
                                        setValue(`${day}.is_available`, checked);
                                        if (!checked) {
                                            setValue(`${day}.start_time`, "09:00");
                                            setValue(`${day}.end_time`, "17:00");
                                        }
                                    }} />
                                }} />

                                <span className="text-[16px] md:text-[18px] font-semibold">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                            </div>

                            {is_available && (
                                <div className="flex gap-4 justify-end border-b border-gray-300 rounded-xl p-2">
                                    <Controller name={`${day}.start_time`} control={control} render={({ field }) => {
                                        return (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-32 text-[16px] cursor-pointer">
                                                    <Clock className="mr-2 h-4 w-4" />
                                                    <SelectValue placeholder="Start Time" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {timeSlots.map((time) => {
                                                        return <SelectItem className="text-[16px]" key={time} value={time}>{time}</SelectItem>
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        )
                                    }} />
                                    <span className="mt-1">To</span>
                                    <Controller name={`${day}.end_time`} control={control} render={({ field }) => {
                                        return (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-32 text-[16px] cursor-pointer">
                                                    <Clock className="mr-2 h-4 w-4" />
                                                    <SelectValue placeholder="End Time" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {timeSlots.map((time) => {
                                                        return <SelectItem className="text-[16px]" key={time} value={time}>{time}</SelectItem>
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        )
                                    }} />
                                    {errors[day] && typeof errors[day] === 'object' && 'end_time' in errors[day] && (
                                        <span className="text-red-500 text-sm ml-2">{(errors[day] as any).end_time?.message}</span>
                                    )}
                                </div>
                            )}

                        </div>
                    )
                })
            }

            <div className="mt-4 flex flex-col md:flex-row items-center justify-start gap-4 border border-gray-300 md:border-gray-200 rounded-xl p-2  md:ml-[185px]">
                <Tooltip>
                    <TooltipTrigger className="md:w-44">Minimum gap before booking (minutes):</TooltipTrigger>
                    <TooltipContent>
                        <p>How soon before a meeting someone can book. E.g. 30 = at least 30 mins ahead.</p>
                    </TooltipContent>
                </Tooltip>
                <Input type="number" {...register("time_gap", {
                    valueAsNumber: true,
                })} className="md:w-32" />
                {
                    errors && typeof errors === 'object' && 'time_gap' in errors && (
                        <span className="text-red-500 text-sm ml-2">{(errors as any).time_gap?.message}</span>
                    )
                }
            </div>
            {error && <div>{(error as { message?: string })?.message ?? "An error occured."}</div>}
            <Button disabled={loading} type="submit" className="mt-4 cursor-pointer text-[16px] !px-4 !py-5">
                {loading ? "Updating..." : "Save Availability"}
            </Button>

            {/* Snackbar */}
            <Toaster
                open={open}
                message={message}
                type={toasterType}
                onClose={handleToasterClose}
            />
        </form>
    )
}
export default AvailabilityForm;