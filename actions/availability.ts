'use server';

import { db } from "@/lib/prisma";
import { error, success } from "@/utils/response";
import { auth } from "@clerk/nextjs/server"

export const getUserAvailability = async () => {
    const { userId } = await auth();

    if (!userId) {
        return error("Unauthorized", 401, "Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerk_user_id: userId },
        include: {
            availability: {
                include: { days: true },
            },
        },
    });

    if (!user || !user.availability || user.availability.length === 0) {
        return null;
    }

    type AvailabilityData = {
        time_gap: number;
        [key: string]: any
    }

    const availability_data: AvailabilityData = {
        time_gap: user.availability[0].time_gap
    };

    [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ].forEach((day) => {
        const data_availability = user.availability[0].days.find((d) => d.day === day.toUpperCase());

        availability_data[day] = {
            is_available: !!data_availability, //!! turns value to boolean
            start_time: data_availability ? data_availability.start_time.toISOString().slice(11, 16) : "09:00",
            end_time: data_availability ? data_availability.end_time.toISOString().slice(11, 16) : "17:00",
        }
    });
    
    return availability_data;
}

type UpdateAvailabilityData = {
    time_gap: number,
    [key: string]: any
}

export const updateUserAvailability = async (data: UpdateAvailabilityData) => {
    const { userId } = await auth();

    if (!userId) {
        return error("Unauthorized", 401, "Unauthorized");
    }

    let base_date;

    const user = await db.user.findUnique({
        where: { clerk_user_id: userId },
        include: {
            availability: true,
        },
    });

    if (!user) {
        return error("User not found", 404, "Not Found");
    }

    const availability_data = Object.entries(data).filter(([key]) => key !== "time_gap").flatMap(([daySchema, { is_available, start_time, end_time }]) => {
        if (is_available) {
            base_date = new Date().toISOString().split('T')[0];
            return [{
                day: daySchema.toLocaleUpperCase() as any,
                start_time: new Date(`${base_date}T${start_time}:00Z`),
                end_time: new Date(`${base_date}T${end_time}:00Z`),
            }];
        }
        return [];
    });

    if (user.availability.length > 0) {
        console.log('Updating existing availability');
        await db.availability.update({
            where: { id: user.availability[0].id },
            data: {
                time_gap: data.time_gap,
                days: {
                    deleteMany: {},
                    create: availability_data,
                }
            }
        });
    } else {
        console.log('Creating new availability');
        await db.availability.create({
            data: {
                user_id: user.id,
                time_gap: data.time_gap,
                days: {
                    create: availability_data,
                }
            }
        });
    }

    return success("Availability updated successfully");
}