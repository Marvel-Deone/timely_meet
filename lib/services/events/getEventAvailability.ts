import { eventRepository } from "@/lib/db/repositories/event.repository"
import { startOfDay, addDays, format } from "date-fns"
import { generateDayAvailableSlots } from "./helpers"

export async function getEventAvailability(eventId: string) {
  const event = await eventRepository.findById(eventId)
  if (!event || !event.user?.availability) return []

  const { availability, bookings } = event.user
  const start_date = startOfDay(new Date())
  const end_date = addDays(start_date, 30)
  const available_dates: any[] = []

  for (let date = start_date; date <= end_date; date = addDays(date, 1)) {
    const day_of_week = format(date, "EEEE").toUpperCase()
    const day_avail = availability.find((avail: any) =>
      avail.days.some((d: any) => d.day === day_of_week)
    )

    if (day_avail) {
      const specific_day = day_avail.days.find((d: any) => d.day === day_of_week)
      if (!specific_day) continue

      const dateStr = format(date, "yyyy-MM-dd")

      const slots = generateDayAvailableSlots(
        specific_day.start_time,
        specific_day.end_time,
        event.duration,
        bookings,
        dateStr,
        day_avail.time_gap
      )

      if (slots.length > 0) {
        available_dates.push({ date: dateStr, slots })
      }
    }
  }

  return available_dates
}
