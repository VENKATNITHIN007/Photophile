import { Suspense } from "react";
import { VerifyEmailForm } from "@/features/auth/components/VerifyEmailForm";
import { AuthShell } from "@/features/auth/components/AuthShell";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailForm />
    </Suspense>
  );
}

function VerifyEmailLoading() {
  return (
    <AuthShell title="Loading..." description="Preparing verification status">
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-muted-foreground"></div>
      </div>
    </AuthShell>
  );
}
