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

const pollOptionSchema = z.object({
    start_time: z.string().min(1, "Start time is required"),
    end_time: z.string().min(1, "End time is required"),
})


export const eventSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(100, "Title must be 100 characters or less"),
    description: z
        .string()
        .min(1, "Description is required")
        .max(300, "Description must be 100 characters or less").optional(),
    type: z.enum(["ONE_ON_ONE", "GROUP", "POLL", "ROUND_ROBIN", "COLLECTIVE"]),
    duration: z.number().int().positive("Duration must be a positive number"),
    capacity: z.number().int().positive("Capacity must be a positive number").nullable().optional(), //it's required only for GROUP events
    is_private: z.boolean(),
    poll_options: z.array(pollOptionSchema).optional()
}).refine(
    (data) => {
        if (data.type === "POLL") {
            return Array.isArray(data.poll_options) && data.poll_options.length >= 2
        }
        return true
    },
    {
        message: "POLL events must have at least 2 time options",
        path: ["poll_options"],
    },
).refine(
    (data) => {
        if (["GROUP", "ROUND_ROBIN", "COLLECTIVE"].includes(data.type)) {
            return data.capacity && data.capacity > 0
        }
        return true
    },
    {
        message: "This event type requires a capacity",
        path: ["capacity"],
    },
);

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
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date foramt").optional(),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time foramt").optional(),
    additional_info: z.string().optional()
});