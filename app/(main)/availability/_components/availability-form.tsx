"use client"

import { updateUserAvailability } from "@/actions/availability"
import { availabilitySchema } from "@/lib/utils/validators"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import useFetch from "@/hooks/use-fetch"
import { zodResolver } from "@hookform/resolvers/zod"
import { Clock, Info, Save } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { timeSlots } from "@/lib/const/availability.data"
import { toast } from "sonner"

type AvailabilityFormProps = {
    initialData: any
}

const AvailabilityForm = ({ initialData }: AvailabilityFormProps) => {
    const days = [
        { key: "monday", label: "Monday", short: "Mon" },
        { key: "tuesday", label: "Tuesday", short: "Tue" },
        { key: "wednesday", label: "Wednesday", short: "Wed" },
        { key: "thursday", label: "Thursday", short: "Thu" },
        { key: "friday", label: "Friday", short: "Fri" },
        { key: "saturday", label: "Saturday", short: "Sat" },
        { key: "sunday", label: "Sunday", short: "Sun" },
    ]

    const getDefaultValues = (initialData: any) => {
        const defaults: any = { time_gap: initialData?.time_gap ?? 0 }
        days.forEach((day) => {
            defaults[day.key] = {
                is_available: initialData?.[day.key]?.is_available ?? false,
                start_time: initialData?.[day.key]?.start_time ?? "09:00",
                end_time: initialData?.[day.key]?.end_time ?? "17:00",
            }
        })
        return defaults
    }

    const defaultValues = getDefaultValues(initialData)

    const {
        handleSubmit,
        control,
        watch,
        setValue,
        register,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(availabilitySchema),
        defaultValues,
    });

    const { fn: fnUpdateAvailability, loading } = useFetch(updateUserAvailability);

    const onSubmit = async (data: any) => {
        try {
            const res = await fnUpdateAvailability(data)
            if (res.success && "data" in res) {
                toast.success(res.message || "Availability updated successfully!");
            } else {
                toast.error(("error" in res && res.error?.message) || "Failed to update availability");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        }
    }

    const availableDays = days.filter((day) => watch(`${day.key}.is_available`));

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Days Grid */}
            <div className="space-y-4">
                {days.map((day) => {
                    const isAvailable = watch(`${day.key}.is_available`)
                    const startTime = watch(`${day.key}.start_time`)
                    const endTime = watch(`${day.key}.end_time`)

                    return (
                        <Card
                            key={day.key}
                            className={`transition-all duration-200 ${isAvailable ? "bg-blue-50/50 border-blue-200 shadow-sm" : "bg-gray-50/50 border-gray-200"
                                }`}
                        >
                            <CardContent className="p-4">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                    {/* Day Selection */}
                                    <div className="flex items-center gap-3 lg:w-48">
                                        <Controller
                                            name={`${day.key}.is_available`}
                                            control={control}
                                            render={({ field }) => (
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={(checked) => {
                                                        setValue(`${day.key}.is_available`, checked)
                                                        if (!checked) {
                                                            setValue(`${day.key}.start_time`, "09:00")
                                                            setValue(`${day.key}.end_time`, "17:00")
                                                        }
                                                    }}
                                                    className="w-5 h-5"
                                                />
                                            )}
                                        />
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900">{day.label}</span>
                                            <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                                                {day.short}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Time Selection */}
                                    {isAvailable ? (
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="flex items-center gap-2 flex-1">
                                                <Controller
                                                    name={`${day.key}.start_time`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="w-full sm:w-32 bg-white">
                                                                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                                                                <SelectValue placeholder="Start" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {timeSlots.map((time) => (
                                                                    <SelectItem key={time} value={time}>
                                                                        {time}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />

                                                <span className="text-gray-500 font-medium">to</span>

                                                <Controller
                                                    name={`${day.key}.end_time`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="w-full sm:w-32 bg-white">
                                                                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                                                                <SelectValue placeholder="End" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {timeSlots.map((time) => (
                                                                    <SelectItem key={time} value={time}>
                                                                        {time}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>

                                            {/* Duration Display */}
                                            <Badge variant="secondary" className="hidden lg:inline-flex">
                                                {startTime && endTime && (
                                                    <>
                                                        {Math.abs(
                                                            new Date(`2000-01-01T${endTime}`).getTime() -
                                                            new Date(`2000-01-01T${startTime}`).getTime(),
                                                        ) /
                                                            (1000 * 60 * 60)}
                                                        h
                                                    </>
                                                )}
                                            </Badge>
                                        </div>
                                    ) : (
                                        <div className="flex-1 text-gray-500 italic">Not available</div>
                                    )}

                                    {/* Error Display */}
                                    {
                                        errors && typeof errors === 'object' && 'time_gap' in errors && (
                                            <span className="text-red-500 text-sm">{(errors as any).time_gap?.message}</span>
                                        )
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Summary */}
            {availableDays.length > 0 && (
                <Card className="bg-green-50/50 border-green-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-800">Available Days Summary</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {availableDays.map((day) => {
                                const startTime = watch(`${day.key}.start_time`)
                                const endTime = watch(`${day.key}.end_time`)
                                return (
                                    <Badge key={day.key} variant="secondary" className="bg-green-100 text-green-800">
                                        {day.short}: {startTime} - {endTime}
                                    </Badge>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Time Gap Setting */}
            <Card className="bg-orange-50/50 border-orange-200">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-2 flex-1">
                            <Info className="w-4 h-4 text-orange-600" />
                            <div>
                                <label className="font-medium text-orange-800">Minimum Booking Notice</label>
                                <p className="text-sm text-orange-700">How far in advance someone must book (in minutes)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                {...register("time_gap", { valueAsNumber: true })}
                                className="w-24 bg-white"
                                placeholder="0"
                            />
                            <span className="text-sm text-gray-600">minutes</span>
                        </div>
                    </div>
                    {/* {errors.time_gap && <span className="text-red-500 text-sm mt-2 block">{errors.time_gap.message}</span>} */}
                    {
                        errors && typeof errors === 'object' && 'time_gap' in errors && (
                            <span className="text-red-500 text-sm mt-2 block">{(errors as any).time_gap?.message}</span>
                        )
                    }
                </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8"
                >
                    {loading ? (
                        <>
                            <Clock className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Availability
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}

export default AvailabilityForm
