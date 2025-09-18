"use client"

import { bookingSchema } from "@/lib/utils/validators"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, CheckCircle, Loader2, Users, Vote } from "lucide-react"
import { useCreateBooking, useCreatePollVote } from "@/lib/api/booking.api"
import { Badge } from "@/components/ui/badge"

interface AvailabilityItem {
  date: string
  slots: string[]
  slot_bookings?: { [key: string]: { current: number; max: number } }
}

interface BookingFormProps {
  event: {
    id: string
    title: string
    duration: number
    type: "ONE_ON_ONE" | "GROUP" | "POLL" | "ROUND_ROBIN" | "COLLECTIVE";
    capacity?: number | null
    poll_options?: Array<{
      id: string
      start_time: Date
      end_time: Date
      votes?: number
    }>
  }
  availability: AvailabilityItem[]
}

interface BookingFormData {
  name: string
  email: string
  date: string
  time: string
  additional_info?: string
}

interface PollVoteData {
  name: string
  email: string
  poll_option_id: string
  additional_info?: string
}

const BookingForm = ({ event, availability }: BookingFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPollOption, setSelectedPollOption] = useState<string | null>(null);
  const [meetLink, setMeetLink] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const {
    register: registerBooking,
    handleSubmit: handleSubmitBooking,
    setValue,
    formState: { errors: bookingErrors },
    reset: resetBooking,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  })

  const {
    register: registerPoll,
    handleSubmit: handleSubmitPoll,
    formState: { errors: pollErrors },
    reset: resetPoll,
  } = useForm<PollVoteData>()

  const available_days = availability.map((day: AvailabilityItem) => new Date(day.date))
  const time_slots = selectedDate
    ? availability.find((day: AvailabilityItem) => day.date === format(selectedDate, "yyyy-MM-dd"))?.slots || []
    : [];

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

  const { mutateAsync: createBooking, isPending, data } = useCreateBooking()
  const { mutateAsync: createVote, isPending: isVoting, data: voteData } = useCreatePollVote()

  const onSubmitBooking = async (formData: BookingFormData) => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time.")
      return
    }

    const start_time = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}`)
    const end_time = new Date(start_time.getTime() + event.duration * 60000)

    try {
      const booking_data = {
        eventId: event.id,
        name: formData.name,
        email: formData.email,
        start_time: start_time.toISOString(),
        end_time: end_time.toISOString(),
        additional_info: formData.additional_info,
      }

      const res = await createBooking(booking_data);
      setMeetLink(res.data.meet_link);

      toast.success("Booking successful! Check your email for details.");
      setStep(4);
      resetBooking();
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to create booking.");
    }
  }

  const onSubmitPollVote = async (formData: PollVoteData) => {
    console.log('Hiddhhh');
    
    if (!selectedPollOption) {
      toast.error("Please select a time option.")
      return
    }

    console.log('Polldddhjh:', formData);
    
    try {
      const vote_data = {
        // eventId: event.id,
        poll_option_id: selectedPollOption,
        name: formData.name,
        email: formData.email,
        // additional_info: forms Data.additional_info,
      }
      const res = await createVote(vote_data);
      console.log('ressff:', res);
      
      toast.success("Vote submitted successfully!");
      setStep(4);
      resetPoll();
      setSelectedPollOption(null);
    } catch (error: any) {
      console.log('Hiisshh', error);
      
      toast.error(error?.message || "Failed to submit vote.");
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date || null)
    setSelectedTime(null)
    if (date) {
      setStep(2)
    }
  }

  const handleTimeSelect = (slot: string) => {
    setSelectedTime(slot)
    setStep(3)
  }

  const handlePollOptionSelect = (optionId: string) => {
    setSelectedPollOption(optionId)
    setStep(3)
  }

  const handleBack = () => {
    if (step === 2) {
      if (event.type === "POLL") {
        setSelectedPollOption(null)
      } else {
        setSelectedDate(null)
      }
      setStep(1)
    } else if (step === 3) {
      if (event.type === "POLL") {
        setSelectedPollOption(null)
        setStep(1) // Go back to poll options
      } else {
        setSelectedTime(null)
        setStep(2)
      }
    }
  }

  const getStepTitle = () => {
    if (event.type === "POLL") {
      if (step === 1) return "Vote for Your Preferred Time"
      if (step === 2) return "Vote for Your Preferred Time"
      if (step === 3) return "Your Information"
      if (step === 4) return "Vote Submitted!"
    } else {
      if (step === 1) return "Select a Date"
      if (step === 2) return "Select a Time"
      if (step === 3) return "Your Information"
      if (step === 4) return "Booking Confirmed!"
    }
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">{getStepTitle()}</CardTitle>
        {event.type === "GROUP" && event.capacity && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>Group event - Max {event.capacity} participants</span>
          </div>
        )}
        {event.type === "POLL" && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Vote className="w-4 h-4" />
            <span>Vote for your preferred meeting time</span>
          </div>
        )}
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
              {event.type === "POLL" ? (
                <>
                  {step === 1 && "Choose your preferred time"}
                  {step === 3 && "Enter your details"}
                </>
              ) : (
                <>
                  Step {step} of 3: {step === 1 && "Choose a date"}
                  {step === 2 && "Pick a time slot"}
                  {step === 3 && "Enter your details"}
                </>
              )}
            </span>
          </div>
        )}

        {event.type === "POLL" && step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Available Time Options</h3>
            {event.poll_options && event.poll_options.length > 0 ? (
              <div className="space-y-3">
                {event.poll_options.map((option) => (
                  <Button
                    key={option.id}
                    onClick={() => handlePollOptionSelect(option.id)}
                    variant={selectedPollOption === option.id ? "default" : "outline"}
                    className={`w-full p-4 h-auto flex items-center justify-between ${selectedPollOption === option.id
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-white hover:bg-gray-100"
                      }`}
                  >
                    <div className="text-left">
                      <div className="font-medium">
                        {format(new Date(option.start_time), "PPP")} at{" "}
                        {format(new Date(option.start_time), "p")}
                      </div>
                      <div className="text-sm opacity-75">
                        {format(new Date(option.start_time), "p")} - {format(new Date(option.end_time), "p")}
                      </div>
                    </div>
                    {option.votes !== undefined && (
                      <Badge variant="secondary" className="ml-2">
                        {option.votes} votes
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No time options available for this poll.</p>
            )}
          </div>
        )}

        {/* Standard booking flow for ONE_ON_ONE and GROUP events */}
        {event.type !== "POLL" && (
          <>
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
                    backgroundColor: "rgb(229 246 255)",
                    borderRadius: "9999px",
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
                }}
              />
            )}

            {/* Step 2: Time Selection */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Available Time Slots for {format(selectedDate!, "PPP")}
                </h3>
                {event.type === "GROUP" && (
                  <p className="text-sm text-gray-600">
                    Multiple people can join the same time slot. Choose any available slot below.
                  </p>
                )}
                {time_slots.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                    {time_slots.map((slot: string, i: number) => {
                      const slotBooking = availability.find(
                        (day: AvailabilityItem) => day.date === format(selectedDate!, "yyyy-MM-dd"),
                      )?.slot_bookings?.[slot]

                      const isGroupFull =
                        event.type === "GROUP" &&
                        slotBooking &&
                        event.capacity &&
                        slotBooking.current >= event.capacity || false;

                      return (
                        <Button
                          key={i}
                          onClick={() => handleTimeSelect(slot)}
                          variant={selectedTime === slot ? "default" : "outline"}
                          disabled={isGroupFull}
                          className={`w-full p-3 h-auto flex flex-col items-center justify-center ${selectedTime === slot
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : isGroupFull
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white hover:bg-gray-100"
                            }`}
                        >
                          <span className="font-medium">{slot}</span>
                          {event.type === "GROUP" && slotBooking && event.capacity && (
                            <span
                              className={`text-xs mt-1 ${selectedTime === slot ? "text-blue-100" : "text-gray-500"}`}
                            >
                              {slotBooking.current}/{event.capacity} joined
                            </span>
                          )}
                          {isGroupFull && <span className="text-xs mt-1 text-red-500 font-medium">FULL</span>}
                        </Button>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-gray-600">No time slots available for this date. Please choose another date.</p>
                )}
              </div>
            )}
          </>
        )}

        {/* Step 3: Enter Details - Different forms for different event types */}
        {step === 3 && (
          <>
            {event.type === "POLL" ? (
              <form onSubmit={handleSubmitPoll(onSubmitPollVote)} className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800">Enter Your Details</h3>
                <div>
                  <Input {...registerPoll("name")} placeholder="Your Name" className="bg-gray-50 border-gray-200" />
                  {pollErrors.name && <p className="text-red-500 text-sm mt-1">{pollErrors.name.message}</p>}
                </div>
                <div>
                  <Input
                    {...registerPoll("email")}
                    type="email"
                    placeholder="Your Email"
                    className="bg-gray-50 border-gray-200"
                  />
                  {pollErrors.email && <p className="text-red-500 text-sm mt-1">{pollErrors.email.message}</p>}
                </div>
                <div>
                  <Textarea
                    {...registerPoll("additional_info")}
                    placeholder="Additional Information (optional)"
                    className="bg-gray-50 border-gray-200 min-h-[100px]"
                  />
                  {pollErrors.additional_info && (
                    <p className="text-red-500 text-sm mt-1">{pollErrors.additional_info.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Vote...
                    </>
                  ) : (
                    "Submit Vote"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmitBooking(onSubmitBooking)} className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800">Enter Your Details</h3>
                <div>
                  <Input {...registerBooking("name")} placeholder="Your Name" className="bg-gray-50 border-gray-200" />
                  {bookingErrors.name && <p className="text-red-500 text-sm mt-1">{bookingErrors.name.message}</p>}
                </div>
                <div>
                  <Input
                    {...registerBooking("email")}
                    type="email"
                    placeholder="Your Email"
                    className="bg-gray-50 border-gray-200"
                  />
                  {bookingErrors.email && <p className="text-red-500 text-sm mt-1">{bookingErrors.email.message}</p>}
                </div>
                <div>
                  <Textarea
                    {...registerBooking("additional_info")}
                    placeholder="Additional Information (optional)"
                    className="bg-gray-50 border-gray-200 min-h-[100px]"
                  />
                  {bookingErrors.additional_info && (
                    <p className="text-red-500 text-sm mt-1">{bookingErrors.additional_info.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {event.type === "GROUP" ? "Joining Group..." : "Scheduling..."}
                    </>
                  ) : event.type === "GROUP" ? (
                    "Join Group Event"
                  ) : (
                    "Schedule Event"
                  )}
                </Button>
              </form>
            )}
          </>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="text-center py-10">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {event.type === "POLL" ? "Vote Submitted!" : "Booking Confirmed!"}
            </h2>
            <p className="text-gray-700 mb-6">
              {event.type === "POLL"
                ? `Your vote for "${event.title}" has been successfully submitted.`
                : event.type === "GROUP"
                  ? `You've successfully joined the group event "${event.title}".`
                  : `Your meeting for "${event.title}" has been successfully scheduled.`}
            </p>
            {meetLink && (
              <p className="text-gray-700 mb-6">
                You can join the meeting here:{" "}
                <a
                  href={meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium break-all"
                >
                  {meetLink}
                </a>
              </p>
            )}
            <p className="text-gray-600">
              {event.type === "POLL"
                ? "You'll be notified when the final meeting time is determined."
                : event.type === "GROUP"
                  ? "You'll be notified when the group event starts."
                  : "A confirmation email with details has been sent to your inbox."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default BookingForm
