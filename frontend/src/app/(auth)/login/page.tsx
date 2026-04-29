"use client";

import { useAuth, useLoginMutation } from "@/features/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { Form } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


function getSafeRedirectPath(redirect: string | null): string | null {
  if (!redirect) return null;

  try {
    const normalized = new URL(redirect, "http://local");
    if (normalized.origin !== "http://local") return null;

    const authPaths = ["/login", "/register"];
    const isAuthRedirect = authPaths.some(
      (path) => normalized.pathname === path || normalized.pathname.startsWith(`${path}/`)
    );

    if (isAuthRedirect) return null;
    return `${normalized.pathname}${normalized.search}`;
  } catch {
    return null;
  }
}

export default function LoginPage() {
  const { user, loading: authLoading, isEmailVerified } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error: showError } = useToast();
  const loginMutation = useLoginMutation();
  const redirectPath = getSafeRedirectPath(searchParams.get("redirect"));

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(isEmailVerified ? (redirectPath || "/dashboard") : "/verify-email/pending");
    }
  }, [user, authLoading, router, isEmailVerified, redirectPath]);

  const onSubmit = async (data: LoginInput) => {
    try {
      await loginMutation.mutateAsync(data);
      router.replace(redirectPath || "/dashboard");
      success("Logged in successfully");
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        showError(err.response.data.message);
      } else {
        showError("Invalid email or password.");
      }
    }
  };

  if (authLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Sign in to your account</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Form.Input
              control={form.control}
              name="email"
              label="Email address"
              type="email"
              placeholder="name@example.com"
              disabled={loginMutation.isPending}
            />
            <Form.Input
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              disabled={loginMutation.isPending}
            />
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm font-medium text-gray-600 hover:text-black hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-sm text-gray-600">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-black hover:underline">
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
