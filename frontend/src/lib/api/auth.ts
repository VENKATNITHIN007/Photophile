import { apiClient } from "@/lib/api-client";
import type { LoginCredentials, RegisterData } from "@/lib/types/auth";

export async function loginUser(credentials: LoginCredentials) {
  const response = await apiClient.post("/auth/login", credentials);
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to login");
  }
  return response.data.data;
}

export async function registerUser(payload: RegisterData) {
  const response = await apiClient.post("/auth/register", payload);
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to register");
  }
  return response.data.data;
}

export async function logoutUser() {
  const response = await apiClient.post("/auth/logout");
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to logout");
  }
  return response.data.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get("/users/me");
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to fetch user");
  }
  return response.data.data;
}

export async function sendVerificationEmail(email: string) {
  const response = await apiClient.post("/auth/verify-email/send", { email });
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to send verification email");
  }
  return response.data.data;
}

export async function verifyEmailToken(token: string) {
  const response = await apiClient.post("/auth/verify-email", { token });
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to verify email");
  }
  return response.data.data;
}

export async function forgotPassword(email: string) {
  const response = await apiClient.post("/auth/forgot-password", { email });
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to request password reset");
  }
  return response.data.data;
}

export async function resetPassword(token: string, newPassword: string) {
  const response = await apiClient.post("/auth/reset-password", { token, newPassword });
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to reset password");
  }
  return response.data.data;
}
