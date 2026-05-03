"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { Form } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLoginMutation } from "@/features/auth";
import { queryKeys } from "@/lib/query/keys";

import { AuthShell } from "./AuthShell";

/**
 * Isolated Login Form component.
 * Handles layout, validation, state, and mutations independently.
 */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { success, error: showError } = useToast();
  const loginMutation = useLoginMutation();
  const queryClient = useQueryClient();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      success("Logged in successfully!");
      
      // Await the session refetch so VerificationGate sees
      // the authenticated user before we navigate.
      await queryClient.refetchQueries({ queryKey: queryKeys.session() });

      const safeRedirect = getSafeRedirectPath(redirect);
      if (safeRedirect) {
        router.push(safeRedirect);
      } else if (response.user.role === "photographer") {
        router.push("/photographer/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      showError(err.message || "Invalid email or password.");
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      description="Enter your credentials to access your photographer studio"
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline underline-offset-4">
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Form.Input
          control={form.control}
          name="email"
          label="Email address"
          type="email"
          placeholder="name@example.com"
          disabled={loginMutation.isPending}
        />
        
        <div className="space-y-1">
          <Form.Input
            control={form.control}
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            disabled={loginMutation.isPending}
          />
          <div className="flex justify-end">
            <Link 
              href="/forgot-password" 
              className="text-xs font-medium text-primary hover:underline underline-offset-4"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]" 
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}

/**
 * Utility to prevent open redirect vulnerabilities.
 */
function getSafeRedirectPath(redirect: string | null): string | null {
  if (!redirect) return null;
  if (redirect.startsWith("/") && !redirect.startsWith("//")) {
    return redirect;
  }
  return null;
}
