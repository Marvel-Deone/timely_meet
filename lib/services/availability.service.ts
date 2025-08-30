import { auth } from "@clerk/nextjs/server";
import { error, success } from "@/lib/response";
import { availabilityRepository } from "../db/repositories/availability.repository";

const dayKeyToEnum = {
    monday: "MONDAY",
    tuesday: "TUESDAY",
    wednesday: "WEDNESDAY",
    thursday: "THURSDAY",
    friday: "FRIDAY",
    saturday: "SATURDAY",
    sunday: "SUNDAY",
} as const;

export const availabilityService = {
    async getUserAvailability() {
        const { userId } = await auth();
        if (!userId) return error("Unauthorized", 401);

        const user = await availabilityRepository.findByUserId(userId);
        if (!user?.availability?.length) return null;

        const avail = user.availability[0];
        const { time_gap, days } = avail;
        const result = { time_gap } as any;

        [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ].forEach((day) => {
            const found = days.find((d: any) => d.day === day.toUpperCase());
            result[day] = {
                is_available: !!found,
                start_time: found ? found.start_time.toISOString().slice(11, 16) : "09:00",
                end_time: found ? found.end_time.toISOString().slice(11, 16) : "17:00",
            };
        });

        return result;
    },

    async updateUserAvailability(data: { time_gap: number, [key: string]: any }) {
        console.log('data:', data);

        const { userId } = await auth();
        if (!userId) return error("Unauthorized", 401);

        let base_date;

        const user = await availabilityRepository.findByUserId(userId);
        if (!user) return error("User not found", 404);

        const availability_data = Object.entries(data).filter(([key]) => key !== "time_gap").flatMap(([daySchema, { is_available, start_time, end_time }]) => {
            const day = dayKeyToEnum[daySchema as keyof typeof dayKeyToEnum];
            console.log('day:', day);

            if (is_available && day) {
                base_date = new Date().toISOString().split('T')[0];
                return [{
                    day,
                    // start_time: new Date(`${base_date}T${start_time}:00Z`),
                    start_time: new Date(`${base_date}T${start_time}:00`),
                    end_time: new Date(`${base_date}T${end_time}:00`),
                }];
            }
            return [];
        });

        if (user.availability.length > 0) {
            await availabilityRepository.update(user.availability[0].id, data.time_gap, availability_data);
        } else {
            await availabilityRepository.create(user.id, data.time_gap, availability_data);
        }

        return success("Availability updated", null);
    },
};
