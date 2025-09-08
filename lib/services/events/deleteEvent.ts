import { auth } from "@clerk/nextjs/server"
import { error, success } from "@/lib/response"
import { eventRepository } from "@/lib/db/repositories/event.repository"
import { userRepository } from "@/lib/db/repositories/user.repository"

export async function deleteUserEvent(eventId: string) {
  const { userId } = await auth()
  if (!userId) return error("Unauthorized", 401)

  const user = await userRepository.findUserById(userId)
  if (!user) return error("User not found", 404, "User not found")

  const event = await eventRepository.findById(eventId)
  if (!event || event.user_id !== user.id) {
    return error("Event not found or unauthorized", 404, "Not Found")
  }

  await eventRepository.delete(eventId)
  return success("Event deleted successfully", null)
}
