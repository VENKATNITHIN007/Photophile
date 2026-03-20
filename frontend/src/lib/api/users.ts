import { privateApiClient } from "@/lib/api-client";
import type { User } from "@/lib/types/auth";

export interface UpdateProfilePayload {
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
}

export async function updateProfile(payload: UpdateProfilePayload) {
  const response = await privateApiClient.put("/users/profile", payload);
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to update profile");
  }
  return response.data.data as User;
}
