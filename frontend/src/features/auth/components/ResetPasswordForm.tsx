"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordInput } from "@/lib/validations/auth";
import { Form } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useResetPasswordMutation } from "@/features/auth";
import { AuthShell } from "./AuthShell";

/**
 * Isolated Reset Password Form component.
 * Manages token validation, complex state transitions, and styling.
 */
export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const { success, error: showError } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (token) {
      form.setValue("token", token);
    }
  }, [token, form]);

  const resetPasswordMutation = useResetPasswordMutation();

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      showError("Invalid or missing reset token.");
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({ token: data.token, newPassword: data.newPassword });
      setSubmitted(true);
      success("Password reset successfully!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      showError(err.message || "Failed to reset password.");
    }
  };

  // ❌ State: No Token
  if (!token) {
    return (
      <AuthShell
        title="Invalid Link"
        description="This password reset link is invalid or has expired. Please request a new one."
        icon={AlertCircle}
        footer={
          <Link
            href="/forgot-password"
            className="flex items-center gap-2 font-semibold text-primary hover:underline underline-offset-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Request new reset link
          </Link>
        }
      >
        <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-red-600 text-sm">
          Security policy: Password reset links are for one-time use only and expire after 1 hour.
        </div>
      </AuthShell>
    );
  }

  // ✅ State: Success
  if (submitted) {
    return (
      <AuthShell
        title="Password Reset!"
        description="Your password has been reset successfully. Redirecting you to login..."
        icon={CheckCircle}
        footer={
          <Link
            href="/login"
            className="flex items-center gap-2 font-semibold text-primary hover:underline underline-offset-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Go to login now
          </Link>
        }
      >
        <div className="flex justify-center py-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
        </div>
      </AuthShell>
    );
  }

  // 📝 State: Standard Form
  return (
    <AuthShell
      title="New Password"
      description="Enter your new password below. Make sure it's strong and secure."
      icon={KeyRound}
      footer={
        <Link
          href="/login"
          className="flex items-center gap-2 font-semibold text-primary hover:underline underline-offset-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <input type="hidden" {...form.register("token")} />

        <Form.Input
          control={form.control}
          name="newPassword"
          label="New password"
          type="password"
          placeholder="••••••••"
          disabled={resetPasswordMutation.isPending}
        />
        
        <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Requirements</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <li className="flex items-center gap-1.5"><CheckCircle className="size-2.5 text-green-500" /> 8+ Characters</li>
            <li className="flex items-center gap-1.5"><CheckCircle className="size-2.5 text-green-500" /> Uppercase</li>
            <li className="flex items-center gap-1.5"><CheckCircle className="size-2.5 text-green-500" /> Lowercase</li>
            <li className="flex items-center gap-1.5"><CheckCircle className="size-2.5 text-green-500" /> Number</li>
            <li className="flex items-center gap-1.5"><CheckCircle className="size-2.5 text-green-500" /> Special Char</li>
          </ul>
        </div>

        <Form.Input
          control={form.control}
          name="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          disabled={resetPasswordMutation.isPending}
        />

        <Button 
          type="submit" 
          className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]" 
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending ? "Resetting..." : "Reset password"}
        </Button>
      </form>
    </AuthShell>
  );
}
