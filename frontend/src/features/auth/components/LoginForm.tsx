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
import { useLoginMutation, getAuthRedirect, getSafeRedirectPath } from "@/features/auth";

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
      
      const safeRedirect = getSafeRedirectPath(redirect);
      const target = safeRedirect || getAuthRedirect(response.user);

      router.push(target);
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
