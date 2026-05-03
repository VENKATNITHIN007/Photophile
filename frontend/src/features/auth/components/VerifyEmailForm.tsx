"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useVerifyEmailMutation } from "@/features/auth";
import { AuthShell } from "./AuthShell";
import { Button } from "@/components/ui/button";

/**
 * Component to handle the email verification link logic.
 */
export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const { mutateAsync } = useVerifyEmailMutation();

  const [status, setStatus] = useState<"loading" | "success" | "error" | "invalid">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      setMessage("Invalid or missing verification token.");
      return;
    }

    const verifyEmail = async () => {
      try {
        await mutateAsync(token);
        setStatus("success");
        setMessage("Your email has been verified successfully!");
        setTimeout(() => router.push("/dashboard"), 2000);
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Failed to verify email.");
      }
    };

    verifyEmail();
  }, [token, mutateAsync, router]);

  if (status === "loading") {
    return (
      <AuthShell title="Verifying email" description="Please wait while we verify your account" icon={Loader2}>
        <div className="py-4 text-center text-sm text-muted-foreground">
          Establishing secure connection...
        </div>
      </AuthShell>
    );
  }

  if (status === "invalid" || status === "error") {
    return (
      <AuthShell title="Verification Failed" description={message} icon={AlertCircle}>
        <Button asChild className="w-full h-11 font-semibold">
          <Link href="/login">Back to Login</Link>
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell 
      title="Email Verified!" 
      description={message} 
      icon={CheckCircle}
      footer={
        <Button asChild variant="outline" className="w-full h-11 font-semibold">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      }
    >
      <div className="text-center py-4 text-sm text-muted-foreground">
        Redirecting you to your studio now...
      </div>
    </AuthShell>
  );
}
