import { eventSchema } from "@/lib/utils/validators"
import { error, success } from "@/lib/response"
import { auth } from "@clerk/nextjs/server"
import { eventRepository } from "@/lib/db/repositories/event.repository"
import { userRepository } from "@/lib/db/repositories/user.repository"

export async function updateUserEvent(eventId: string, data: typeof eventSchema._input) {
  const { userId } = await auth()
  if (!userId) return error("Unauthorized", 401)

  const validatedData = eventSchema.parse(data)

  const user = await userRepository.findUserById(userId)
  if (!user) return error("User not found", 404, "User not found")

  const event = await eventRepository.findByIdAndUser(eventId, userId)
  if (!event || event.user_id !== user.id) {
    return error("Event not found", 404, "Not Found")
  }

  const updatedEvent = await eventRepository.update(eventId, validatedData)
  return success("Event updated successfully", updatedEvent)
}
