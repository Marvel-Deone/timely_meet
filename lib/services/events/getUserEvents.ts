import { auth } from "@clerk/nextjs/server"
import { error, success } from "@/lib/response"
import { eventRepository } from "@/lib/db/repositories/event.repository"

export async function getUserEvents() {
  const { userId } = await auth()
  if (!userId) return error("Unauthorized", 401)

  const userEvents = await eventRepository.findUserEvents(userId)
  return success("User events fetched successfully", userEvents)
}
