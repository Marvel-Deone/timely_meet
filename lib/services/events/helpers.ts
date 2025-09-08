import { addMinutes, format, isBefore, parseISO } from "date-fns"

export function generateDayAvailableSlots(
  start_time: Date,
  end_time: Date,
  duration: number,
  bookings: any[],
  dateStr: string,
  timeGap = 0
) {
  const slots: string[] = []
  const start = parseISO(`${dateStr}T${format(start_time, "HH:mm")}`)
  const end = parseISO(`${dateStr}T${format(end_time, "HH:mm")}`)
  let current_time = start
  const now = new Date()

  if (format(now, "yyyy-MM-dd") === dateStr) {
    const adjusted_now = addMinutes(now, timeGap)
    if (isBefore(current_time, adjusted_now)) current_time = adjusted_now
  }

  while (current_time < end) {
    const slot_end = addMinutes(current_time, duration)
    if (slot_end > end) break

    const isAvailable = !bookings.some((booking) => {
      const booking_start = new Date(booking.start_time)
      const booking_end = new Date(booking.end_time)
      return (
        (current_time >= booking_start && current_time < booking_end) ||
        (slot_end > booking_start && slot_end <= booking_end) ||
        (current_time <= booking_start && slot_end >= booking_end)
      )
    })

    if (isAvailable) slots.push(format(current_time, "HH:mm"))
    current_time = addMinutes(current_time, duration)
  }
  return slots
}
