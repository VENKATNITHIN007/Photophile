"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validations/auth";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/lib/api/auth";

export default function ForgotPasswordPage() {
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setLoading(true);

    try {
      await forgotPasswordMutation.mutateAsync(data.email);
      setSubmitted(true);
      success("If an account exists with this email, you will receive password reset instructions.");
    } catch (err) {
      // Show generic message to prevent email enumeration
      setSubmitted(true);
      success("If an account exists with this email, you will receive password reset instructions.");
    } finally {
      setLoading(false);
      forgotPasswordMutation.reset();
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Check your email</CardTitle>
            <CardDescription>
              If an account exists with this email, you will receive password reset instructions shortly.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col items-center justify-center text-sm">
            <Link
              href="/login"
              className="flex items-center gap-2 font-medium text-black hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Mail className="h-6 w-6 text-gray-600" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Forgot your password?</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you instructions to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                control={form.control}
                name="email"
                label="Email address"
                type="email"
                placeholder="name@example.com"
                disabled={loading}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send reset instructions"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-sm">
          <Link
            href="/login"
            className="flex items-center gap-2 font-medium text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
