// lib/services/booking.service.ts
import { db } from "@/lib/db/prisma";
import { error, success } from "@/lib/response";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { bookingRepository } from "../db/repositories/booking.repository";
import { pollVoteRepository } from "../db/repositories/pollvote.repository";

export const bookingService = {
    createBooking: async (bookingData: any) => {
        console.log('stsarting..');
        try {
            const event = await db.event.findUnique({
                where: { id: bookingData.eventId },
                include: { user: true },
            });
            console.log('event:', event);

            if (!event) return error("Event not found", 404, "Not Found");

            // Clerk user
            const client = await clerkClient();
            const user = await client.users.getUser(event.user.clerk_user_id);
            console.log('About to check google acc...');

            const hasGoogle = user.externalAccounts?.some(acc => acc.provider === "oauth_google");
            if (!hasGoogle) return error("Event Creator has not connected Google Calendar", 403, "Forbidden");
            console.log('Google acc found');

            const { data } = await client.users.getUserOauthAccessToken(event.user.clerk_user_id, "oauth_google");
            console.log('Google token data', data);

            const token = data?.[0]?.token;
            console.log('Token:', token);

            if (!token) return error("Google token not found", 403, "Forbidden");

            // Google Calendar
            const oauth2Client = new google.auth.OAuth2();
            console.log('oauth2Client:', oauth2Client);

            oauth2Client.setCredentials({ access_token: token });
            console.log('Credential set');

            const calendar = google.calendar({ version: "v3", auth: oauth2Client });
            console.log('Calendar instance created');

            const meet = await calendar.events.insert({
                calendarId: "primary",
                conferenceDataVersion: 1,
                requestBody: {
                    summary: `${bookingData.name} - ${event.title}`,
                    description: bookingData.additional_info,
                    start: { dateTime: bookingData.start_time },
                    end: { dateTime: bookingData.end_time },
                    attendees: [{ email: bookingData.email }, { email: event.user.email }],
                    conferenceData: { createRequest: { requestId: `${event.id}-${Date.now()}` } },
                },
            });
            console.log('meet:', meet);

            const booking = await bookingRepository.create({
                event_id: event.id,
                user_id: event.user_id,
                name: bookingData.name,
                email: bookingData.email,
                start_time: bookingData.start_time,
                end_time: bookingData.end_time,
                additional_info: bookingData.additional_info,
                meet_link: meet.data.hangoutLink ?? "",
                google_event_id: meet.data.id ?? "",
            });
            console.log('booking created:', booking);

            return success("Booking created successfully", { booking, meet_link: booking.meet_link });
        } catch (err: any) {
            console.log('Error:', err);

            return error(err.message || "Failed to create booking", 500, "Internal Server Error");
        }
    },

    pollVoting: async (pollVoteData: any) => {
        console.log('stsarting..');
        try {
            const poll_options = await db.pollOption.findUnique({
                where: { id: pollVoteData.poll_option_id },
            });
            console.log('poll_options:', poll_options);

            if (!poll_options) return error("Poll options not found", 404, "Not Found");

            // // Clerk user
            // const client = await clerkClient();
            // const user = await client.users.getUser(event.user.clerk_user_id);
            // console.log('About to check google acc...');

            // const hasGoogle = user.externalAccounts?.some(acc => acc.provider === "oauth_google");
            // if (!hasGoogle) return error("Event Creator has not connected Google Calendar", 403, "Forbidden");
            // console.log('Google acc found');

            // const { data } = await client.users.getUserOauthAccessToken(event.user.clerk_user_id, "oauth_google");
            // console.log('Google token data', data);

            // const token = data?.[0]?.token;
            // console.log('Token:', token);

            // if (!token) return error("Google token not found", 403, "Forbidden");

            // // Google Calendar
            // const oauth2Client = new google.auth.OAuth2();
            // console.log('oauth2Client:', oauth2Client);

            // oauth2Client.setCredentials({ access_token: token });
            // console.log('Credential set');

            // const calendar = google.calendar({ version: "v3", auth: oauth2Client });
            // console.log('Calendar instance created');

            // const meet = await calendar.events.insert({
            //     calendarId: "primary",
            //     conferenceDataVersion: 1,
            //     requestBody: {
            //         summary: `${bookingData.name} - ${event.title}`,
            //         description: bookingData.additional_info,
            //         start: { dateTime: bookingData.start_time },
            //         end: { dateTime: bookingData.end_time },
            //         attendees: [{ email: bookingData.email }, { email: event.user.email }],
            //         conferenceData: { createRequest: { requestId: `${event.id}-${Date.now()}` } },
            //     },
            // });
            // console.log('meet:', meet);

            const poll_votes = await pollVoteRepository.create({
                poll_option_id: poll_options.id,
                voter_name: pollVoteData.name,
                voter_email: pollVoteData.email,
            });
            console.log('pollvotes added:', poll_votes);

            return success("Poll Vote added successfully", { poll_votes });
        } catch (err: any) {
            console.log('Error:', err);

            return error(err.message || "Failed to create booking", 500, "Internal Server Error");
        }
    },

    // getPollVotes: async () => {
    //     const { userId } = await auth();
    //     if (!userId) return error("Unauthorized", 401);

    //     const userEvents = await eventRepository.findUserEvents(userId);

    //     return success("User events fetched successfully", userEvents);
    // },
    
    cancelBooking: async (bookingId: string) => {
        try {
            const { userId } = await auth();
            if (!userId) return error("Unauthorized", 401, "Unauthorized");

            const booking = await bookingRepository.findById(bookingId);
            if (!booking) return error("Booking not found", 404, "Not Found");

            if (booking.event.user.clerk_user_id !== userId) {
                return error("No permission to cancel", 403, "Forbidden");
            }

            // Clerk & Google
            const client = await clerkClient();
            const user = await client.users.getUser(booking.event.user.clerk_user_id);
            const hasGoogle = user.externalAccounts?.some(acc => acc.provider === "oauth_google");
            if (!hasGoogle) return error("Google Calendar not connected", 403, "Forbidden");

            const { data } = await client.users.getUserOauthAccessToken(booking.event.user.clerk_user_id, "oauth_google");
            const token = data?.[0]?.token;
            if (!token) return error("Google token not found", 403, "Forbidden");

            const oauth2Client = new google.auth.OAuth2();
            oauth2Client.setCredentials({ access_token: token });
            const calendar = google.calendar({ version: "v3", auth: oauth2Client });

            if (booking.google_event_id) {
                try {
                    await calendar.events.delete({ calendarId: "primary", eventId: booking.google_event_id });
                } catch (e: any) {
                    console.warn("Failed to delete Google event:", e.message);
                }
            }

            await bookingRepository.delete(bookingId);

            return success("Booking cancelled successfully", {
                bookingId: booking.id,
                eventTitle: booking.event.title,
                attendeeName: booking.name,
                attendeeEmail: booking.email,
            });
        } catch (err: any) {
            return error(err.message || "Failed to cancel booking", 500, "Internal Server Error");
        }
    },
};
