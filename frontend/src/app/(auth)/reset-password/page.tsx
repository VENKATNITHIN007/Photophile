import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { AuthShell } from "@/features/auth/components/AuthShell";

/**
 * Reset Password Route.
 * Uses Suspense because ResetPasswordForm calls useSearchParams().
 */
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordLoading() {
  return (
    <AuthShell title="Loading..." description="Please wait while we prepare your reset link">
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-muted-foreground"></div>
      </div>
    </AuthShell>
  );
}
