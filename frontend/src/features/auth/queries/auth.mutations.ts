import { useMutation } from "@tanstack/react-query";
import {
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
  sendVerificationEmail,
  verifyEmailToken,
} from "@/lib/api/auth";
import type { LoginCredentials, RegisterData } from "@/lib/types/auth";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginCredentials) => loginUser(payload),
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterData) => registerUser(payload),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (payload: { token: string; newPassword: string }) =>
      resetPassword(payload.token, payload.newPassword),
  });
}

export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: (token: string) => verifyEmailToken(token),
  });
}

export function useSendVerificationEmailMutation() {
  return useMutation({
    mutationFn: (email: string) => sendVerificationEmail(email),
  });
}
