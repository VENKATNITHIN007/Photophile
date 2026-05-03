"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, RefreshCw } from "lucide-react";
import { useAuth, useCurrentUserQuery, useSendVerificationEmailMutation } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AuthShell } from "./AuthShell";

/**
 * Component for the 'Verification Sent' screen.
 */
export function VerifyEmailPendingForm() {
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
    if (!user?.email) return;
    try {
      await resendMutation.mutateAsync(user.email);
      success("Verification email sent!");
    } catch (error: any) {
      showError(error.message || "Failed to resend.");
    }
  };

  const handleCheckAgain = async () => {
    try {
      setChecking(true);
      const result = await refetch();
      if (result.data?.isEmailVerified) {
        success("Email verified!");
        router.push("/dashboard");
        return;
      }
      showError("Still unverified. Please click the link in your email.");
    } catch (error: any) {
      showError(error.message || "Failed to refresh.");
    } finally {
      setChecking(false);
    }
  };

  if (loading || !user) {
    return (
      <AuthShell title="Loading..." icon={RefreshCw}>
        <div className="flex justify-center py-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-muted-foreground"></div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Verify email"
      description={`We sent a verification link to ${user.email}`}
      icon={Mail}
      footer={
        <Link href="/login" className="text-sm font-semibold text-primary hover:underline underline-offset-4">
          Back to login
        </Link>
      }
    >
      <div className="space-y-6">
        <p className="text-center text-sm text-muted-foreground">
          You must verify your email before accessing your studio and premium features.
        </p>
        
        <div className="space-y-3">
          <Button className="w-full h-11 font-semibold" onClick={handleResend} disabled={resendMutation.isPending}>
            {resendMutation.isPending ? "Sending..." : "Resend verification email"}
          </Button>
          <Button
            variant="outline"
            className="w-full h-11 font-semibold"
            onClick={handleCheckAgain}
            disabled={checking || isFetching}
          >
            <RefreshCw className={`mr-2 size-4 ${checking || isFetching ? "animate-spin" : ""}`} />
            I have verified my email
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}
