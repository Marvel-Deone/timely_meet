"use client"

import { bookingSchema } from "@/lib/validators"
import useFetch from "@/hooks/use-fetch"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { createBooking } from "@/actions/booking"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, CheckCircle, Loader2 } from "lucide-react"

interface AvailabilityItem {
  date: string
  slots: string[]
}

interface BookingFormProps {
  event: any
  availability: AvailabilityItem[]
}

interface BookingFormData {
  name: string
  email: string
  date: string
  time: string
  additional_info?: string
}

const BookingForm = ({ event, availability }: BookingFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [step, setStep] = useState(1) // 1: Select Date, 2: Select Time, 3: Enter Details, 4: Confirmation

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  })

  const available_days = availability.map((day: AvailabilityItem) => new Date(day.date))
  const time_slots = selectedDate
    ? availability.find((day: AvailabilityItem) => day.date === format(selectedDate, "yyyy-MM-dd"))?.slots || []
    : []

  useEffect(() => {
    if (selectedDate) {
      setValue("date", format(selectedDate, "yyyy-MM-dd"))
    }
  }, [selectedDate, setValue])

  useEffect(() => {
    if (selectedTime) {
      setValue("time", selectedTime)
    }
  }, [selectedTime, setValue])

  const { loading, data, fn: fnCreateBooking } = useFetch(createBooking)

  const onSubmit = async (formData: BookingFormData) => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time.")
      return
    }

    const start_time = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}`)
    const end_time = new Date(start_time.getTime() + event.duration * 60000)

    const booking_data = {
      eventId: event.id,
      name: formData.name,
      email: formData.email,
      start_time: start_time.toISOString(),
      end_time: end_time.toISOString(),
      additional_info: formData.additional_info,
    }

    const res = await fnCreateBooking(booking_data)

    if (res.success) {
      toast.success("Booking successful! Check your email for details.")
      setStep(4) // Move to confirmation step
      reset() // Reset form fields
      setSelectedDate(null)
      setSelectedTime(null)
    } else {
      toast.error(res.error?.message || "Failed to create booking.")
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date || null)
    setSelectedTime(null) // Reset time when date changes
    if (date) {
      setStep(2) // Move to time selection step
    }
  }

  const handleTimeSelect = (slot: string) => {
    setSelectedTime(slot)
    setStep(3) // Move to details step
  }

  const handleBack = () => {
    if (step === 2) {
      setSelectedDate(null)
      setStep(1)
    } else if (step === 3) {
      setSelectedTime(null)
      setStep(2)
    }
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">
          {step === 1 && "Select a Date"}
          {step === 2 && "Select a Time"}
          {step === 3 && "Your Information"}
          {step === 4 && "Booking Confirmed!"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {step < 4 && (
          <div className="flex items-center gap-2 mb-6">
            {step > 1 && (
              <Button variant="ghost" size="icon" onClick={handleBack} className="text-gray-600">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            <span className="text-sm font-medium text-gray-700">
              Step {step} of 3: {step === 1 && "Choose a date"}
              {step === 2 && "Pick a time slot"}
              {step === 3 && "Enter your details"}
            </span>
          </div>
        )}

        {/* Step 1: Date Selection */}
        {step === 1 && (
          <DayPicker
            mode="single"
            selected={selectedDate || undefined}
            onSelect={handleDateSelect}
            disabled={[{ before: new Date() }]}
            modifiers={{ available: available_days }}
            modifiersStyles={{
              available: {
                backgroundColor: "rgb(229 246 255)", // blue-50
                borderRadius: "9999px", // full rounded
              },
            }}
            className="w-full flex justify-center"
            classNames={{
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
              day_range_end: "day-range-end",
              day_selected:
                "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white",
              day_today: "bg-gray-100 text-gray-900",
              day_outside: "text-gray-500 opacity-50",
              day_disabled: "text-gray-400 opacity-50",
              day_range_middle: "aria-selected:bg-gray-100 aria-selected:text-gray-900",
              day_hidden: "invisible",
              day_range_start: "day-range-start",
            //   day_selected_range_end: "day-range-end",
            }}
          />
        )}

        {/* Step 2: Time Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Available Time Slots for {format(selectedDate!, "PPP")}
            </h3>
            {time_slots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-2">
                {time_slots.map((slot: string) => (
                  <Button
                    key={slot}
                    onClick={() => handleTimeSelect(slot)}
                    variant={selectedTime === slot ? "default" : "outline"}
                    className={`w-full ${selectedTime === slot ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white hover:bg-gray-100"}`}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No time slots available for this date. Please choose another date.</p>
            )}
          </div>
        )}

        {/* Step 3: Enter Details */}
        {step === 3 && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800">Enter Your Details</h3>
            <div>
              <Input {...register("name")} placeholder="Your Name" className="bg-gray-50 border-gray-200" />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Input
                {...register("email")}
                type="email"
                placeholder="Your Email"
                className="bg-gray-50 border-gray-200"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Textarea
                {...register("additional_info")}
                placeholder="Additional Information (optional)"
                className="bg-gray-50 border-gray-200 min-h-[100px]"
              />
              {errors.additional_info && <p className="text-red-500 text-sm mt-1">{errors.additional_info.message}</p>}
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Schedule Event"
              )}
            </Button>
          </form>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && data && (
          <div className="text-center py-10">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
            <p className="text-gray-700 mb-6">Your meeting for "{event.title}" has been successfully scheduled.</p>
            {data.meet_link && (
              <p className="text-gray-700 mb-6">
                You can join the meeting here:{" "}
                <a
                  href={data.meet_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium break-all"
                >
                  {data.meet_link}
                </a>
              </p>
            )}
            <p className="text-gray-600">A confirmation email with details has been sent to your inbox.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default BookingForm
