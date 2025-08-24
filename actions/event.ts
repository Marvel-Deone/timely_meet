'use server';

import { eventSchema } from "@/lib/utils/validators";
import { db } from "@/lib/db/prisma";
import { error, success } from "@/lib/response";
import { auth } from "@clerk/nextjs/server";
import { addDays, addMinutes, format, isBefore, parseISO, startOfDay } from "date-fns";

export const createEvent = async (data: typeof eventSchema._input) => {
    const { userId } = await auth();

    if (!userId) {
        return error("Unauthorized", 401, "Unauthorized");
    }

    const validatedData = eventSchema.parse(data);

    const user = await db.user.findUnique({ where: { clerk_user_id: userId } });
    if (!user) {
        return error("User not found", 404, "Not Found");
    }

    const event = await db.event.create({
        data: {
            ...validatedData,
            user_id: user.id
        }
    });

    return success('Event created successfully', event);
}

export const getUserEvents = async () => {
    const { userId } = await auth();
    try {
        if (!userId) {
            return error("Unauthorized", 401, "Unauthorized");
        }
        console.log('userId', userId);

        const user = await db.user.findUnique({ where: { clerk_user_id: userId } });
        if (!user) return error("User not found", 404, "Not Found");
        const events = await db.event.findMany({
            where: { user_id: user.id },
            orderBy: { created_at: "desc" },
            include: {
                _count: {
                    select: { bookings: true }
                },
            },
        });
        console.log("Fetching Event");
        const data = { events, username: user.username };
        console.log('Fetched');
        console.log('Done');
        return success('User events fetched successfully', data);
    } catch (err: any) {
        console.log('mydsdsg:', err);
        return error(err instanceof Error ? err.message : String(err), err instanceof Error && err.message ? 400 : 500, err instanceof Error && err.message ? "Bad Request" : "Internal Server Error");
    }
}

export const deleteUserEvent = async (eventId: string) => {
    const { userId } = await auth();

    if (!userId) {
        return error("Unauthorized", 401, "Unauthorized");
    }


    const user = await db.user.findUnique({ where: { clerk_user_id: userId } });
    if (!user) {
        return error("User not found", 404, "Not Found");
    }

    const event = await db.event.findUnique({ where: { id: eventId } });

    if (!event || event.user_id !== user.id) {
        return error("Event not found or unauthorized", 404, "Not Found");
    }

    await db.event.delete({
        where: { id: eventId }
    });

    return success('Event deleted successfully', null);
}

export const getEventDetails = async (username: string, eventId: string) => {
    const event = await db.event.findUnique({
        where: {
            id: eventId,
            user: {
                username
            },
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    username: true,
                    image_url: true,
                },
            },
        },
    });

    return event;
}

export const getOwnedEventDetails = async (eventId: string) => {
    const { userId } = await auth();
    let user_id;
    if (userId) user_id = userId;
    const event = await db.event.findFirst({
        where: {
            id: eventId,
            user: {
                clerk_user_id: user_id
            }
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    username: true,
                    image_url: true,
                },
            },
        },
    });

    if (!event) throw new Error("Unauthorized or not found");
    return success('Event details fetched successfully', event);
};


export const getEventAvailability = async (eventId: string) => {
    const event = await db.event.findUnique({
        where: { id: eventId },
        include: {
            user: {
                include: {
                    availability: {
                        select: {
                            days: true,
                            time_gap: true,
                        },
                    },
                    bookings: {
                        select: {
                            start_time: true,
                            end_time: true,
                        },
                    },
                },
            },
        },
    });

    if (!event || !event.user.availability) return [];

    const { availability, bookings } = event.user;

    const start_date = startOfDay(new Date());
    const end_date = addDays(start_date, 30);

    const available_dates = [];

    for (let date = start_date; date <= end_date; date = addDays(date, 1)) {
        const day_of_week = format(date, "EEEE").toUpperCase();

        // Find availability for the current day
        const day_avail = availability.find((avail) =>
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
}

const generateDayAvailableSlots = (
    start_time: Date,
    end_time: Date,
    duration: number,
    bookings: any[],
    dateStr: any,
    timeGap = 0
) => {
    const slots: string[] = [];

    const start = parseISO(`${dateStr}T${format(start_time, "HH:mm")}`);
    const end = parseISO(`${dateStr}T${format(end_time, "HH:mm")}`);

    let current_time = start;
    const now = new Date();

    // If date is today, avoid past time slots
    if (format(now, "yyyy-MM-dd") === dateStr) {
        const adjusted_now = addMinutes(now, timeGap);
        if (isBefore(current_time, adjusted_now)) {
            current_time = adjusted_now;
        }
    }

    while (current_time < end) {
        const slot_end = addMinutes(current_time, duration);

        // Ensure the slot stays within the day's working hours
        if (slot_end > end) break;

        const is_slot_available = !bookings.some((booking) => {
            const booking_start = new Date(booking.start_time);
            const booking_end = new Date(booking.end_time);

            return (
                (current_time >= booking_start && current_time < booking_end) ||
                (slot_end > booking_start && slot_end <= booking_end) ||
                (current_time <= booking_start && slot_end >= booking_end)
            );
        });

        if (is_slot_available) {
            slots.push(format(current_time, "HH:mm"));
        }

        current_time = addMinutes(current_time, duration);
    }
    return slots;
};

export const updateUserEvent = async (eventId: string, data: typeof eventSchema._input) => {
    const { userId } = await auth();

    if (!userId) {
        return error("Unauthorized", 401, "Unauthorized");
    }

    const validatedData = eventSchema.parse(data);

    const user = await db.user.findUnique({ where: { clerk_user_id: userId } });
    if (!user) {
        return error("User not found", 404, "Not Found");
    }
    const event = await db.event.findUnique({ where: { id: eventId } });

    if (!event || event.user_id !== user.id) {
        return error("Event not found or unauthorized", 404, "Not Found");
    }

    await db.event.update({
        where: { id: eventId },
        data: validatedData
    });

    return success('Event updated successfully', null);
}