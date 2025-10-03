import { eventSchema } from "@/lib/utils/validators";
import { error, success } from "@/lib/response";
import { auth } from "@clerk/nextjs/server";
import { addDays, addMinutes, endOfDay, format, isBefore, parseISO, startOfDay } from "date-fns";
import { eventRepository } from "../db/repositories/event.repository";
import { userRepository } from "../db/repositories/user.repository";

export const eventService = {
    async createEvent(data: typeof eventSchema._input) {
        const { userId } = await auth();

        if (!userId) return error("Unauthorized", 401);
        const validatedData = eventSchema.parse(data);
        const user = await userRepository.findUserById(userId);

        if (!user) return error("User not found", 404, "User not found");

        const event = await eventRepository.create({ ...validatedData, user_id: user.id });
        return success("Event created successfully", event);
    },

    async getUserEvents(params?: { type?: string; status?: string }) {
        const { userId } = await auth();
        if (!userId) return error("Unauthorized", 401);

        // Define allowed enums
        const allowedTypes = ["ONE_ON_ONE", "GROUP", "POLL", "ROUND_ROBIN", "COLLECTIVE"] as const;
        const allowedStatuses = ["active", "completed", "cancelled"] as const;

        // Start building safe params
        const safeParams: {
            type?: typeof allowedTypes[number];
            status?: typeof allowedStatuses[number];
        } = {};

        if (params?.type && allowedTypes.includes(params.type as any)) {
            safeParams.type = params.type as typeof allowedTypes[number];
        }

        if (params?.status && allowedStatuses.includes(params.status as any)) {
            safeParams.status = params.status as typeof allowedStatuses[number];
        }

        const userEvents = await eventRepository.findUserEvents(userId, safeParams);
        return success("User events fetched successfully", userEvents);
    },

    async deleteUserEvent(eventId: string) {
        const { userId } = await auth();
        if (!userId) return error("Unauthorized", 401);

        const user = await userRepository.findUserById(userId);
        if (!user) return error("User not found", 404, "User not found");

        const event = await eventRepository.findById(eventId);
        if (!event || event.user_id !== user.id) return error("Event not found or unauthorized", 404, "Not Found");

        await eventRepository.delete(eventId);
        return success("Event deleted successfully", null);
    },

    async getEventDetails(username: string, eventId: string) {
        const event = await eventRepository.findByUsernameAndId(username, eventId);
        if (!event) return error("Unauthorized or not found", 404);
        console.log('EventD:', event);
        console.log('Not:', event.poll_options.length);

        if (event.poll_options && event.status === "finalized") {
            console.log('Hinbnddnn:', event.poll_options.length);
            let finalized_time = event.poll_options.find(option => option.id === event.finalized_option_id) || null;
            const data = { ...event, finalized_time }
            return success("Event details fetched successfully", data);
        }

        return success("Event details fetched successfully", event);
    },

    async getOwnedEventDetails(eventId: string) {
        const { userId } = await auth();
        if (!userId) return error("Unauthorized", 401);

        const event = await eventRepository.findByIdAndUser(eventId, userId);
        if (!event) return error("Unauthorized or not found", 404);

        return success("Event details fetched successfully", event);
    },

    async getPollEventDetails(eventId: string) {
        const { userId } = await auth();
        if (!userId) return error("Unauthorized", 401);

        const event = await eventRepository.findPollEventById(eventId, userId);
        if (!event) return error("Unauthorized or not found", 404);

        return success("Poll event details fetched successfully", event);
    },

    async updateUserEvent(eventId: string, data: typeof eventSchema._input) {
        const { userId } = await auth();
        if (!userId) return error("Unauthorized", 401);
        const validatedData = eventSchema.parse(data);

        // Check User
        const user = await userRepository.findUserById(userId);
        if (!user) return error("User not found", 404, "User not found");

        const event = await eventRepository.findByIdAndUser(eventId, userId);

        if (!event || event.user_id !== user.id) return error("Event not found", 404, "Not Found");
        const updatedEvent = await eventRepository.update(eventId, validatedData);

        return success("Event updated successfully", updatedEvent);
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

                // Only allow supported event types for slot generation
                const allowedTypes = ["ONE_ON_ONE", "GROUP", "POLL"] as const;
                const safeEventType = allowedTypes.includes(event.type as any) ? event.type as "ONE_ON_ONE" | "GROUP" | "POLL" : "ONE_ON_ONE";
                const slots = generateDayAvailableSlots(
                    specific_day.start_time,
                    specific_day.end_time,
                    event.duration,
                    bookings,
                    dateStr,
                    day_avail.time_gap,
                    safeEventType,
                    event.type === "GROUP" ? event.capacity || Infinity : Infinity,
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
    timeGap = 0,
    event_type: "ONE_ON_ONE" | "GROUP" | "POLL" = "ONE_ON_ONE",
    group_capacity: number = Infinity
) {
    const slots: string[] = [];
    const start = parseISO(`${dateStr}T${format(start_time, "HH:mm")}`);
    const end = parseISO(`${dateStr}T${format(end_time, "HH:mm")}`);
    let current_time = start;
    const now = new Date();

    if (format(now, "yyyy-MM-dd") === dateStr) {
        let adjusted_now = addMinutes(now, timeGap);
        adjusted_now = alignToDuration(adjusted_now, duration);
        if (isBefore(current_time, adjusted_now)) current_time = adjusted_now;
    }
    // Pre-filter bookings to those overlapping this date
    const dayStart = startOfDay(parseISO(dateStr));
    const dayEnd = endOfDay(parseISO(dateStr));
    const dayBookings = bookings
        .map(b => ({ start: new Date(b.start_time), end: new Date(b.end_time), event: b.event }))
        .filter(b => b.end > dayStart && b.start < dayEnd);

    while (current_time < end) {
        const slot_end = addMinutes(current_time, duration);
        if (slot_end > end) break;

        // Get bookings overlapping this slot
        const overlappingBookings = dayBookings.filter(b =>
            (current_time >= b.start && current_time < b.end) ||
            (slot_end > b.start && slot_end <= b.end) ||
            (current_time <= b.start && slot_end >= b.end)
        );

        let isAvailable = false;
        if (event_type === "ONE_ON_ONE") {
            // Only free if no overlaps
            isAvailable = overlappingBookings.length === 0;
        } else if (event_type === "GROUP") {
            // Free if current group capacity is not exceeded
            const groupBookings = overlappingBookings.filter(b => b.event?.type === "GROUP");
            isAvailable = groupBookings.length < group_capacity;
        } else if (event_type === "POLL") {
            // Poll slots are always available?
            isAvailable = true;
        }

        if (isAvailable) {
            slots.push(format(current_time, "HH:mm"));
        }

        const overlaps = dayBookings.some(b => (
            (current_time >= b.start && current_time <= b.end) ||
            (slot_end > b.start && slot_end <= b.end) ||
            (current_time <= b.start && slot_end >= b.end)
        ));

        if (!overlaps) {
            slots.push(format(current_time, "HH:mm"));
        }
        current_time = addMinutes(current_time, duration);
    }
    return slots;
}

function alignToDuration(date: Date, duration: number) {
    const minutes = date.getMinutes();
    const remainder = minutes % duration;
    if (remainder === 0) return date; // already aligned
    return addMinutes(date, duration - remainder); // ceil to next multiple
}

