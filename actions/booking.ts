'use server';

// import { sendEmail } from "@/app/lib/sendEmail";
import { db } from "@/lib/prisma"
import { error, success } from "@/lib/response";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis";

export const createBooking = async (booking_data: any) => {
    try {
        const event = await db.event.findUnique({
            where: { id: booking_data.eventId },
            include: { user: true }
        });

        if (!event) {
            return error("Event not found", 404, "Not Found");
        }
        // Use google calendar api to generate meet link and add to calendar
        const client = await clerkClient();
        const user = await client.users.getUser(event.user.clerk_user_id);

        const hasGoogleAccountConnected = user.externalAccounts?.some(
            (acc) => acc.provider === "oauth_google"
        );

        if (!hasGoogleAccountConnected) {
            return error("Event Creator has not connected Google Calendar", 403, "Forbidden");
        }

        const { data } = await client.users.getUserOauthAccessToken(event.user.clerk_user_id, "oauth_google");

        if (!data || data.length === 0 || !data[0].token) {
            return error("Event Creator has not connected Google Calendar", 403, "Forbidden");
        }

        const token = data[0]?.token;
        // Set up Google OAuth client
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: token });
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        const meet_response = await calendar.events.insert({
            calendarId: "primary",
            conferenceDataVersion: 1,
            requestBody: {
                summary: `${booking_data.name} - ${event.title}`,
                description: booking_data.additional_info,
                start: { dateTime: booking_data.start_time },
                end: { dateTime: booking_data.end_time },
                attendees: [{ email: booking_data.email }, { email: event.user.email }],
                conferenceData: {
                    createRequest: { requestId: `${event.id}-${Date.now()}` }
                }
            }
        });
        const meet_link = meet_response.data.hangoutLink;
        const google_event_id = meet_response.data.id;
        const booking = await db.booking.create({
            data: {
                event_id: event.id,
                user_id: event.user_id,
                name: booking_data.name,
                email: booking_data.email,
                start_time: booking_data.start_time,
                end_time: booking_data.end_time,
                additional_info: booking_data.additional_info,
                meet_link: meet_link ?? "",
                google_event_id: google_event_id ?? ""
            }
        });
        const res = { booking, meet_link }
        return success("Booking created successfully", res);
    } catch (err: any) {
        return error(err instanceof Error ? err.message : String(err), err instanceof Error && err.message ? 400 : 500, err instanceof Error && err.message ? "Bad Request" : "Internal Server Error");
    }
}

export const cancelBooking = async (bookingId: string) => {
    try {
        const { userId } = await auth()
        if (!userId) {
            return error("Unauthorized", 401, "Unauthorized")
        }

        const booking = await db.booking.findUnique({
            where: { id: bookingId },
            include: {
                event: {
                    include: { user: true },
                },
            },
        })

        if (!booking) {
            return error("Booking not found", 404, "Not Found")
        }

        if (booking.event.user.clerk_user_id !== userId) {
            return error("You don't have permission to cancel this booking", 403, "Forbidden")
        }

        const client = await clerkClient()
        const user = await client.users.getUser(booking.event.user.clerk_user_id)
        const hasGoogleAccountConnected = user.externalAccounts?.some((acc) => acc.provider === "oauth_google")

        if (!hasGoogleAccountConnected) {
            return error("Google Calendar not connected", 403, "Forbidden")
        }

        const { data } = await client.users.getUserOauthAccessToken(booking.event.user.clerk_user_id, "oauth_google")

        if (!data || data.length === 0 || !data[0].token) {
            return error("Google Calendar access token not found", 403, "Forbidden")
        }

        const token = data[0]?.token

        const oauth2Client = new google.auth.OAuth2()
        oauth2Client.setCredentials({ access_token: token })
        const calendar = google.calendar({ version: "v3", auth: oauth2Client })

        if (booking.google_event_id) {
            try {
                await calendar.events.delete({
                    calendarId: "primary",
                    eventId: booking.google_event_id,
                })
            } catch (calendarError: any) {
                console.warn("Failed to delete Google Calendar event:", calendarError.message)
            }
        }

        await db.booking.delete({
            where: { id: bookingId },
        })

        return success("Booking cancelled successfully", {
            bookingId: booking.id,
            eventTitle: booking.event.title,
            attendeeName: booking.name,
            attendeeEmail: booking.email,
        })
    } catch (err: any) {
        console.error("Cancel booking error:", err)
        return error(
            err instanceof Error ? err.message : String(err),
            err instanceof Error && err.message ? 400 : 500,
            err instanceof Error && err.message ? "Bad Request" : "Internal Server Error",
        )
    }
}