import { eventSchema } from "@/lib/utils/validators";
import { error, success } from "@/lib/response";
import { auth } from "@clerk/nextjs/server";
import { addDays, addMinutes, format, isBefore, parseISO, startOfDay } from "date-fns";
import { eventRepository } from "../db/repositories/event.repository";
import { userRepository } from "../db/repositories/user.repository";

export const eventService = {
    async createEvent(data: typeof eventSchema._input) {
        const { userId } = await auth();
        console.log('clerk_user_id:', userId);

        if (!userId) return error("Unauthorized", 401);

        const validatedData = eventSchema.parse(data);

        const user = await userRepository.findUserById(userId);

        if (!user) return error("User not found", 404, "User not found");

        const event = await eventRepository.create({ ...validatedData, user_id: user.id });
        return success("Event created successfully", event);
    },

    async getUserEvents() {
        const { userId } = await auth();
        if (!userId) return error("Unauthorized", 401);

        console.log('userId:', userId);
        const userEvents = await eventRepository.findUserEvents(userId);

        console.log('Hi:', userEvents);

        return success("User events fetched successfully", userEvents);
    },

    async deleteUserEvent(eventId: string) {
        const { userId } = await auth();
        if (!userId) return error("Unauthorized", 401);

        const user = await userRepository.findUserById(userId);
        if (!user) return error("User not found", 404, "User not found");
        
        const event = await eventRepository.findById(eventId);
        if (!event || event.user_id !== user.id) return error("Event not found or unauthorized", 404);

        await eventRepository.delete(eventId);
        return success("Event deleted successfully", null);
    },

    async getEventDetails(username: string, eventId: string) {
        return await eventRepository.findByUsernameAndId(username, eventId);
    },

    async getOwnedEventDetails(eventId: string) {
        const { userId } = await auth();
        if (!userId) return error("Unauthorized", 401);

        const event = await eventRepository.findByIdAndUser(eventId, userId);
        if (!event) return error("Unauthorized or not found", 404);

        return success("Event details fetched successfully", event);
    },

    async updateUserEvent(eventId: string, data: typeof eventSchema._input) {
        const { userId } = await auth();
        if (!userId) return error("Unauthorized", 401);

        const validatedData = eventSchema.parse(data);
        const event = await eventRepository.findById(eventId);
        if (!event || event.user_id !== userId) return error("Event not found or unauthorized", 404);

        await eventRepository.update(eventId, validatedData);
        return success("Event updated successfully", null);
    },

    async getEventAvailability(eventId: string) {
        const event = await eventRepository.findById(eventId);
        if (!event || !event.user?.availability) return [];

        const { availability, bookings } = event.user;
        const start_date = startOfDay(new Date());
        const end_date = addDays(start_date, 30);
        const available_dates: any[] = [];

        for (let date = start_date; date <= end_date; date = addDays(date, 1)) {
            const day_of_week = format(date, "EEEE").toUpperCase();
            const day_avail = availability.find((avail: any) =>
                avail.days.some((d: any) => d.day === day_of_week)
            );

            if (day_avail) {
                const specific_day = day_avail.days.find((d: any) => d.day === day_of_week);
                if (!specific_day) continue;

                const dateStr = format(date, "yyyy-MM-dd");

                const slots = generateDayAvailableSlots(
                    specific_day.start_time,
                    specific_day.end_time,
                    event.duration,
                    bookings,
                    dateStr,
                    day_avail.time_gap
                );

                if (slots.length > 0) {
                    available_dates.push({ date: dateStr, slots });
                }
            }
        }
        return available_dates;
    },
};

function generateDayAvailableSlots(
    start_time: Date,
    end_time: Date,
    duration: number,
    bookings: any[],
    dateStr: string,
    timeGap = 0
) {
    const slots: string[] = [];
    const start = parseISO(`${dateStr}T${format(start_time, "HH:mm")}`);
    const end = parseISO(`${dateStr}T${format(end_time, "HH:mm")}`);
    let current_time = start;
    const now = new Date();

    if (format(now, "yyyy-MM-dd") === dateStr) {
        const adjusted_now = addMinutes(now, timeGap);
        if (isBefore(current_time, adjusted_now)) current_time = adjusted_now;
    }

    while (current_time < end) {
        const slot_end = addMinutes(current_time, duration);
        if (slot_end > end) break;

        const isAvailable = !bookings.some((booking) => {
            const booking_start = new Date(booking.start_time);
            const booking_end = new Date(booking.end_time);
            return (
                (current_time >= booking_start && current_time < booking_end) ||
                (slot_end > booking_start && slot_end <= booking_end) ||
                (current_time <= booking_start && slot_end >= booking_end)
            );
        });

        if (isAvailable) slots.push(format(current_time, "HH:mm"));
        current_time = addMinutes(current_time, duration);
    }
    return slots;
}
