import { time } from "console";
import { title } from "process";
import { z } from "zod";

export const usernameSchema = z.object({
    username: z
        .string()
        .min(3)
        .max(20)
        .regex(
            /^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers, and underscores"
        )
});

export const eventSchema = z.object({
    title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
    description: z
    .string()
    .min(1, "Description is required")
    .max(300, "Description must be 100 characters or less"),
    duration: z.number().int().positive("Duration must be a positive number"),
    is_private: z.boolean()
});

export const daySchema = z.object({
    is_available: z.boolean(),
    start_time: z.string().optional(),
    end_time: z.string().optional()
}).refine((data) => {
    if (data.is_available) {
        return (
            typeof data.start_time === "string" &&
            typeof data.end_time === "string" &&
            data.start_time < data.end_time
        );
    }
    return true;
},
{
    message: "End time must be after start time",
    path: ["end_time"]
}
);

export const availabilitySchema = z.object({
    monday: daySchema,
    tuesday: daySchema,
    wednesday: daySchema,
    thursday: daySchema,
    friday: daySchema,
    saturday: daySchema,
    sunday: daySchema,
    time_gap: z.number().min(0, "Time gap must be 0 or more minutes").int()
});

export const bookingSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date foramt"),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time foramt"),
    additional_info: z.string().optional()
});