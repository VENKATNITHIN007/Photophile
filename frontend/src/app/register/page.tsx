"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const { user, register, loading: authLoading } = useAuth();
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);

    try {
      // Hardcode role to "user" as per requirement
      await register({
        name: data.fullName,
        email: data.email,
        password: data.password,
        role: "user"
      });
      success("Account created successfully");
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        showError(err.response.data.message);
      } else {
        showError("Registration failed. Please try again.");
      }
      setLoading(false);
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
          <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription>
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                control={form.control}
                name="fullName"
                label="Full Name"
                placeholder="John Doe"
                disabled={loading}
              />
              <FormInput
                control={form.control}
                name="email"
                label="Email address"
                type="email"
                placeholder="name@example.com"
                disabled={loading}
              />
              <FormInput
                control={form.control}
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                disabled={loading}
              />
              <FormInput
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                disabled={loading}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Register"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-sm text-gray-600">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-black hover:underline">
              Sign in here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}