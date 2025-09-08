import { auth } from "@clerk/nextjs/server"
import { error, success } from "@/lib/response"
import { eventRepository } from "@/lib/db/repositories/event.repository"

export async function getOwnedEventDetails(eventId: string) {
  const { userId } = await auth()
  if (!userId) return error("Unauthorized", 401)

  const event = await eventRepository.findByIdAndUser(eventId, userId)
  if (!event) return error("Unauthorized or not found", 404)

  return success("Event details fetched successfully", event)
}
