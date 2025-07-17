'use client';

import { bookingSchema } from "@/app/lib/validators";
import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { createBooking } from "@/actions/booking";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertColor } from "@mui/material";
import Toaster from "@/components/dashboard/Toaster";

interface AvailabilityItem {
    date: string;
    slots: string[]
}

interface BookingFormProps {
    event: any;
    availability: AvailabilityItem[];
}

interface BookingFormData {
    name: string;
    email: string;
    date: string;
    time: string;
    additional_info?: string;
}

const BookingForm = ({ event, availability }: BookingFormProps) => {
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [selectedTime, setSelectedTime] = useState<any>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [toasterType, setToasterType] = useState<AlertColor>('success');
    const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm({
        resolver: zodResolver(bookingSchema)
    });

    const available_days = availability.map((day: AvailabilityItem) => new Date(day.date));

    const time_slots = selectedDate ? availability.find((day: AvailabilityItem) => day.date === format(selectedDate, "yyyy-MM-dd"))?.slots || [] : [];

    useEffect(() => {
        if (selectedDate) {
            setValue("date", format(selectedDate, "yyyy-MM-dd"));
        }
    }, [selectedDate]);

    useEffect(() => {
        if (selectedTime) {
            setValue("time", selectedTime);
        }
    }, [selectedTime]);

    const handleToasterClose = () => setOpen(false);

    const { loading, data, fn: fnCreateBooking } = useFetch(createBooking);

    const onSubmit = async (data: BookingFormData) => {
        if (!selectedDate || !selectedTime) {
            console.error("Date or time not selected: ", data);
            return;
        }

        const start_time = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}`);
        const end_time = new Date(start_time.getTime() + event.duration * 60000);

        const booking_data = {
            eventId: event.id,
            name: data.name,
            email: data.email,
            start_time: start_time.toISOString(),
            end_time: end_time.toISOString(),
            additional_info: data.additional_info
        }

        const res = await fnCreateBooking(booking_data);

        if (!res.success) {
            setOpen(true);
            setToasterType('error');
            setMessage(res.error.message);
        }
    };

    const onError = (errors: any) => {
        console.error('Validation failed:', errors);
    };

    if (data) {
        return (
            <>
                {
                    data.booking ?
                        <div className="text-center p-10 border bg-white">
                            <h2 className="text-2xl font-bold mb-4">Booking Succcessful!</h2>
                            {data.meet_link && (
                                <p>
                                    Join the meeting:{" "}
                                    <a href={data.meet_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{data.meet_link}</a>
                                </p>
                            )}
                        </div> : <div className="text-center p-10 border bg-white">
                            <h2 className="text-2xl font-bold mb-4">Booking failed</h2>
                        </div>
                }
            </>
        )
    }

    return (
        <div className="flex flex-col gap-8 p-10 border bg-white">
            <div className="md:h-96 flex flex-col md:flex-row gap-5">
                <div className="w-full">
                    <DayPicker mode="single" selected={selectedDate} onSelect={(date) => {
                        setSelectedDate(date);
                        setSelectedTime(null);
                    }} disabled={[{ before: new Date() }]}
                        modifiers={{ available: available_days }}
                        modifiersStyles={{
                            available: {
                                background: 'lightblue',
                                borderRadius: 100
                            }
                        }}
                    />
                </div>
                <div className="w-full h-full md:overflow-scroll no-scrollbar">
                    {selectedDate && (
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Available Time Slots</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                {time_slots.map((slot: any) => (
                                    <Button key={slot} onClick={() => setSelectedTime(slot)} variant={selectedTime === slot ? "default" : "outline"} className="cursor-pointer">{slot}</Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {selectedTime && <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
                <div>
                    <Input {...register("name")} placeholder="Your Name" />
                    {errors.name && (
                        <p className="text-red text-sm">{errors.name.message}</p>
                    )}
                </div>
                <div>
                    <Input {...register("email")} type="email" placeholder="Your Email" />
                    {errors.email && (
                        <p className="text-red text-sm">{errors.email.message}</p>
                    )}
                </div>
                <div>
                    <Textarea {...register("additional_info")} placeholder="Additional Information" />
                    {errors.additional_info && (
                        <p className="text-red text-sm">{errors.additional_info.message}</p>
                    )}
                </div>
                <Button type='submit' disabled={loading} className='cursor-pointer'>
                    {loading ? "Scheduling..." : "Schedule Event"}
                </Button>
            </form>}

            {/* Snackbar */}
            <Toaster
                open={open}
                message={message}
                type={toasterType}
                onClose={handleToasterClose}
            />
        </div>
    )
}

export default BookingForm;