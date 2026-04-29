"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, RefreshCw } from "lucide-react";
import { useAuth, useCurrentUserQuery, useSendVerificationEmailMutation } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function VerifyEmailPendingPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const { user, loading, isEmailVerified } = useAuth();
  const resendMutation = useSendVerificationEmailMutation();
  const { refetch, isFetching } = useCurrentUserQuery(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (!loading && user && isEmailVerified) {
      router.push("/dashboard");
    }
  }, [loading, user, isEmailVerified, router]);

  const handleResend = async () => {
    if (!user?.email) {
      showError("Unable to find your account email.");
      return;
    }

    try {
      await resendMutation.mutateAsync(user.email);
      success("Verification email sent", "Check your inbox and spam folder.");
    } catch (error) {
      showError((error as Error).message || "Failed to resend verification email.");
    }
  };

  const handleCheckAgain = async () => {
    try {
      setChecking(true);
      const result = await refetch();
      if (result.data?.isEmailVerified) {
        success("Email verified", "Redirecting to your dashboard.");
        router.push("/dashboard");
        return;
      }
      showError("Your email is still unverified. Open the email link, then try again.");
    } catch (error) {
      showError((error as Error).message || "Failed to refresh verification status.");
    } finally {
      setChecking(false);
    }
  };

  if (loading || !user) {
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
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <Mail className="h-6 w-6 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Verify your email</CardTitle>
          <CardDescription>
            We sent a verification link to <span className="font-medium text-black">{user.email}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <p>You must verify your email before accessing your dashboard and protected features.</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={handleResend} disabled={resendMutation.isPending}>
            {resendMutation.isPending ? "Sending..." : "Resend verification email"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleCheckAgain}
            disabled={checking || isFetching}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${checking || isFetching ? "animate-spin" : ""}`} />
            I have verified my email
          </Button>
          <Link href="/login" className="text-sm text-gray-600 hover:text-black hover:underline">
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
