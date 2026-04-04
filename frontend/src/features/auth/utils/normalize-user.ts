import type { BackendUser, User } from "@/lib/types/auth";

export const normalizeUser = (rawUser: BackendUser): User => {
  return {
    id: rawUser._id || rawUser.id || "",
    name: rawUser.fullName || rawUser.name || "",
    email: rawUser.email,
    role: rawUser.role,
    avatar: rawUser.avatar,
    phoneNumber: rawUser.phoneNumber,
    isEmailVerified: rawUser.isEmailVerified,
  };
};
