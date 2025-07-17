'use server';

// import { sendEmail } from "@/app/lib/sendEmail";
import { db } from "@/lib/prisma"
import { error, success } from "@/utils/response";
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
        console.log('MyUserAccount', user.externalAccounts);
        console.log('Hellohh');

        const userOauthTokens = await client.users.getUserOauthAccessToken(event.user.clerk_user_id, "google");
        console.log("hygyfy");

        console.log("OAuth Tokens:", userOauthTokens);
        console.log('Continue');

        const { data } = await client.users.getUserOauthAccessToken(event.user.clerk_user_id, "google");
        console.log('Yes, init:', data);

        if (!data || data.length === 0 || !data[0].token) {
            console.log("Can't find data");
            return error("Event Creator has not connected Google Calendar", 403, "Forbidden");
        }

        console.log("I'm with data");

        const token = data[0]?.token;
        console.log('Got the token:', token);

        // Set up Google OAuth client
        const oauth2Client = new google.auth.OAuth2();
        console.log('Setting up');
        oauth2Client.setCredentials({ access_token: token });
        console.log('Setting up done');
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        console.log('calendar initialized', calendar);
        console.log('Inserting booking into calendar');
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
        console.log('Done inserting');
        const meet_link = meet_response.data.hangoutLink;
        const google_event_id = meet_response.data.id;
        console.log('Checking meet link:', meet_link);
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
        console.log('Booking created:', booking);
        const res = { booking, meet_link }
        return success("Booking created successfully", res);
    } catch (err: any) {
        console.log('errorjjd:', err instanceof Error, 'myError', err);
        return error(err instanceof Error ? err.message : String(err), err instanceof Error && err.message ? 400 : 500, err instanceof Error && err.message ? "Bad Request" : "Internal Server Error");
    }
}