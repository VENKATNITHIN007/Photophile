"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validations/auth";
import { Form } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForgotPasswordMutation } from "@/features/auth";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { AuthShell } from "./AuthShell";

/**
 * Isolated Forgot Password Form component with its own success state.
 */
export function ForgotPasswordForm() {
  const { success } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useForgotPasswordMutation();

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      await forgotPasswordMutation.mutateAsync(data.email);
      setSubmitted(true);
      success("Instructions sent!");
    } catch {
      // Generic success to prevent email enumeration
      setSubmitted(true);
    } finally {
      forgotPasswordMutation.reset();
    }
  };

  if (submitted) {
    return (
      <AuthShell
        title="Check your email"
        description="If an account exists with this email, you will receive password reset instructions shortly."
        icon={CheckCircle}
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
        <div className="text-center py-4 text-sm text-muted-foreground">
          Still don&apos;t see it? Check your spam folder or try another email.
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset Password"
      description="Enter your email address and we'll send you instructions to reset your password"
      icon={Mail}
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
        <Form.Input
          control={form.control}
          name="email"
          label="Email address"
          type="email"
          placeholder="name@example.com"
          disabled={forgotPasswordMutation.isPending}
        />
        <Button 
          type="submit" 
          className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]" 
          disabled={forgotPasswordMutation.isPending}
        >
          {forgotPasswordMutation.isPending ? "Sending..." : "Send reset instructions"}
        </Button>
      </form>
    </AuthShell>
  );
}
