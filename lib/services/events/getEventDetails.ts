import { eventRepository } from "@/lib/db/repositories/event.repository"

export async function getEventDetails(username: string, eventId: string) {
    return await eventRepository.findByUsernameAndId(username, eventId)
}