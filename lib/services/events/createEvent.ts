import { eventSchema } from "@/lib/utils/validators"
import { error, success } from "@/lib/response"
import { auth } from "@clerk/nextjs/server"
import { eventRepository } from "@/lib/db/repositories/event.repository"
import { userRepository } from "@/lib/db/repositories/user.repository"

export async function createEvent(data: typeof eventSchema._input) {
  const { userId } = await auth()
  if (!userId) return error("Unauthorized", 401)

  const validatedData = eventSchema.parse(data)

  const user = await userRepository.findUserById(userId)
  if (!user) return error("User not found", 404, "User not found")

  const event = await eventRepository.create({ ...validatedData, user_id: user.id })
  return success("Event created successfully", event)
}