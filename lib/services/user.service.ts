import { clerkClient } from "@clerk/nextjs/server";
import { success, error } from "@/lib/response";
import { userRepository } from "../db/repositories/user.repository";

export async function updateUsername(userId: string, username: string) {
  try {
    const existing = await userRepository.findUserByUsername(username);

    if (existing && existing.clerk_user_id !== userId) {
      return error("Username is already taken", 403, "Forbidden");
    }

    await userRepository.updateUserByClerkId(userId, { username });
    await (await clerkClient()).users.updateUser(userId, { username });

    return success("User profile updated successfully", null);
  } catch (err) {
    console.error("Service Error:", err);
    return error("Internal server error", 500, "Internal Server Error");
  }
}

export async function getUserProfile(username: string) {
  try {
    const user = await userRepository.getUserProfileWithEvents(username);

    if (!user) {
      return error("User not found", 404, "Not Found");
    }

    return success("User profile fetched successfully", user);
  } catch (err) {
    console.error("Service Error:", err);
    return error("Internal server error", 500, "Internal Server Error");
  }
}
