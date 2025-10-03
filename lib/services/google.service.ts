import { google } from "googleapis";
import { bookingRepository } from "../db/repositories/booking.repository";
import { clerkClient } from "@clerk/nextjs/server";
import { error, success } from "../response";
import { randomUUID } from "crypto";
import { db } from "../db/prisma";

export const googleService = {
    createEvent: async ({
        id,
        organizer,
        title,
        start,
        end,
        attendees,
    }: {
        id: string
        organizer: any
        title: string
        start: string
        end: string
        attendees: Array<{ email: string }>
    }) => {
        try {
            console.log('Hi, I am here');
            const event = await db.event.findUnique({
                where: { id },
                include: { user: true },
            });

            if (!event) return error("Event not found", 404, "Not Found");

            // Clerk user
            const client = await clerkClient();
            const user = await client.users.getUser(event.user.clerk_user_id);

            console.log("I'm user", user);

            const hasGoogle = user.externalAccounts?.some(acc => acc.provider === "oauth_google");
            if (!hasGoogle) return error("Event Creator has not connected Google Calendar", 403, "Forbidden");
            console.log('hasGoogle:', hasGoogle);

            const { data } = await client.users.getUserOauthAccessToken(event.user.clerk_user_id, "oauth_google");
            console.log('data:', data);

            const token = data?.[0]?.token;


            if (!token) return error("Google token not found", 403, "Forbidden");

            // Google Calendar
            const oauth2Client = new google.auth.OAuth2();
            console.log('oauth2Client:', oauth2Client);

            oauth2Client.setCredentials({ access_token: token });

            const calendar = google.calendar({ version: "v3", auth: oauth2Client });
            console.log('calendar:', calendar);

            const meet = await calendar.events.insert({
                calendarId: "primary",
                conferenceDataVersion: 1,
                requestBody: {
                    summary: `${event.title}`,
                    // description: bookingData.additional_info,
                    start: { dateTime: start },
                    end: { dateTime: end },
                    attendees: [
                        ...attendees.map(a => ({ email: a.email })),
                        { email: organizer.email },
                    ],
                    conferenceData: { createRequest: { requestId: `${event.id}-${Date.now()}` } },
                },
            });

            console.log('meeting:', meet);

            console.log('Yeah, it did, but is it okay:', meet);


            const googleEvent = meet.data;

            return success("Google event created successfully", {
                id: googleEvent.id,
                link: googleEvent.hangoutLink,
            });
        } catch (err: any) {
            return error(err.message || "Failed to create booking", 500, "Internal Server Error");
        }
    },
};
