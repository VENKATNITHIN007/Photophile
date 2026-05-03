"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { Form } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRegisterMutation } from "@/features/auth";
import { AxiosError } from "axios";

import { AuthShell } from "./AuthShell";
import Link from "next/link";

/**
 * Isolated Register Form component.
 */
export function RegisterForm() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const registerMutation = useRegisterMutation();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await registerMutation.mutateAsync({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      router.push("/verify-email/pending");
      success("Account created. Please verify your email.");
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        showError(err.response.data.message);
      } else {
        showError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <AuthShell
      title="Create an account"
      description="Join Photophile and start showcasing your creative portfolio"
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline underline-offset-4">
            Sign in here
          </Link>
        </p>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Form.Input
          control={form.control}
          name="fullName"
          label="Full Name"
          placeholder="John Doe"
          disabled={registerMutation.isPending}
        />
        <Form.Input
          control={form.control}
          name="email"
          label="Email address"
          type="email"
          placeholder="name@example.com"
          disabled={registerMutation.isPending}
        />
        <Form.Input
          control={form.control}
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          disabled={registerMutation.isPending}
        />
        <Form.Input
          control={form.control}
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          disabled={registerMutation.isPending}
        />
        <Button 
          type="submit" 
          className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]" 
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Creating account..." : "Register"}
        </Button>
      </form>
    </AuthShell>
  );
}
