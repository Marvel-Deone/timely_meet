import { error, success } from "@/lib/response";
import { auth } from "@clerk/nextjs/server";
import { eventRepository } from "../db/repositories/event.repository";
import { pollVoteRepository } from "../db/repositories/pollvote.repository";
import { userRepository } from "../db/repositories/user.repository";
import { db } from "../db/prisma";
import { bookingRepository } from "../db/repositories/booking.repository";
import { googleService } from "./google.service";
import { emailService } from "./email.service";

export const pollService = {
    getPollEventDetails: async (eventId: string) => {
        const { userId } = await auth();
        if (!userId) return error("Unauthorized", 401);

        const event = await eventRepository.findPollEventById(eventId, userId);
        if (!event) return error("Unauthorized or not found", 404);

        return success("Poll event details fetched successfully", event);
    },

    pollVoting: async (pollVoteData: any) => {
        try {
            const event = await eventRepository.findById(pollVoteData.eventId);
            if (!event) return error("Event not found", 404, "Not Found");
            const poll_options = await db.pollOption.findUnique({
                where: { id: pollVoteData.poll_option_id },
            });

            if (event.status === "finalized") {
                return error("Voting is closed for this event", 403);
            }

            if (!poll_options) return error("Poll options not found", 404, "Not Found");

            const poll_votes = await pollVoteRepository.create({
                poll_option_id: poll_options.id,
                voter_name: pollVoteData.name,
                voter_email: pollVoteData.email,
            });

            return success("Poll Vote added successfully", { poll_votes });
        } catch (err: any) {

            return error(err.message || "Failed to create booking", 500, "Internal Server Error");
        }
    },

    finalizeEventTime: async (eventId: string, chosenOptionId: string) => {
        const { userId } = await auth();
        if (!userId) return error("Unauthorized", 401);

        const user = await userRepository.findUserById(userId);
        if (!user) return error("User not found", 404);

        const event = await eventRepository.findByIdAndUser(eventId, userId);
        if (!event || event.user_id !== user.id) return error("Event not found", 404, "Not Found");

        // DB work in a transaction
        const { updatedEvent, chosenOption, voters } = await db.$transaction(async (tx) => {
            const updatedEvent = await eventRepository.finalizeEvent(tx, eventId, chosenOptionId);

            const chosenOption = updatedEvent.poll_options.find(o => o.id === chosenOptionId);
            if (!chosenOption) throw new Error("Chosen option not found");

            await bookingRepository.createBookingsFromVotes(
                tx,
                updatedEvent.id,
                updatedEvent.user_id,
                chosenOption,
                chosenOption.votes.map(v => ({ name: v.voter_name, email: v.voter_email }))
            );

            return {
                updatedEvent,
                chosenOption,
                voters: chosenOption.votes.map(v => ({ name: v.voter_name, email: v.voter_email })),
            };
        });

        try {
            const meet = await googleService.createEvent({
                id: updatedEvent.id,
                organizer: updatedEvent.user,
                title: updatedEvent.title,
                start: chosenOption.start_time.toISOString(),
                end: chosenOption.end_time.toISOString(),
                attendees: voters.map(v => ({ email: v.email })),
            });

            if (meet.success && meet.data) {
                if (typeof meet.data.link === "string" && typeof meet.data.id === "string") {
                    await eventRepository.attachMeetLink(
                        db,
                        updatedEvent.id,
                        meet.data.link,
                        meet.data.id
                    );
                } else {
                    throw new Error("Meet link or ID is missing or invalid");
                }

                await emailService.sendFinalizedPollEmails(updatedEvent, meet.data.link);
            }

            return success("Poll finalized successfully", { event: updatedEvent, meet });
        } catch (err) {
            return error("Poll finalized in DB, but integrations failed", 500);
        }
    }

}