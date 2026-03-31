import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    forgotPassword,
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
    resetPassword,
    sendVerificationEmail,
    verifyEmailToken,
} from "@/lib/api/auth";
import { updateProfile, type UpdateProfilePayload } from "@/lib/api/users";
import type { LoginCredentials, RegisterData } from "@/lib/types/auth";
import { queryKeys } from "@/lib/query/keys";

// ── Queries ────────────────────────────────────────────────────────

export function useCurrentUserQuery(enabled = true) {
    return useQuery({
        queryKey: queryKeys.session(),
        queryFn: getCurrentUser,
        enabled,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
}

// ── Auth Mutations ─────────────────────────────────────────────────

export function useLoginMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: LoginCredentials) => loginUser(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.session() });
        },
    });
}

export function useRegisterMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: RegisterData) => registerUser(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.session() });
        },
    });
}

export function useLogoutMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => logoutUser(),
        onSettled: () => {
            qc.clear();
        },
    });
}

// ── Email Verification ─────────────────────────────────────────────

export function useVerifyEmailMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (token: string) => verifyEmailToken(token),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.session() });
        },
    });
}

export function useSendVerificationEmailMutation() {
    return useMutation({
        mutationFn: (email: string) => sendVerificationEmail(email),
    });
}

// ── Password Reset ─────────────────────────────────────────────────

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

// ── User Profile ───────────────────────────────────────────────────

export function useUpdateProfileMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.session() });
        },
    });
}
