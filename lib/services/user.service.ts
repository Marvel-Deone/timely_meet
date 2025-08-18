import { clerkClient } from "@clerk/nextjs/server";
import { success, error } from "@/lib/response";
import { findUserByUsername, getUserProfileWithEvents, updateUserByClerkId } from "../db/repositories/user.repository";

export async function updateUsername(userId: string, username: string) {
  try {
    const existing = await findUserByUsername(username);

    if (existing && existing.clerk_user_id !== userId) {
      return error("Username is already taken", 403, "Forbidden");
    }

    await updateUserByClerkId(userId, { username });
    await (await clerkClient()).users.updateUser(userId, { username });

    return success("User profile updated successfully", null);
  } catch (err) {
    console.error("Service Error:", err);
    return error("Internal server error", 500, "Internal Server Error");
  }
}

export async function getUserProfile(username: string) {
  try {
    const user = await getUserProfileWithEvents(username);

    if (!user) {
      return error("User not found", 404, "Not Found");
    }

    return success("User profile fetched successfully", user);
  } catch (err) {
    console.error("Service Error:", err);
    return error("Internal server error", 500, "Internal Server Error");
  }
}
