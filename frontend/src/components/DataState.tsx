import React, { ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";

// 1. Loading State
function Loading({ className }: { className?: string }) {
  return (
    <div className={`flex min-h-[16rem] items-center justify-center ${className || ""}`}>
      <Spinner size="md" />
    </div>
  );
}

// 2. Error State
interface ErrorProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

function ErrorState({ message = "An error occurred", onRetry, className }: ErrorProps) {
  return (
    <Alert variant="destructive" className={className}>
      <div className="flex items-center justify-between">
        <AlertDescription>{message}</AlertDescription>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="ml-4 shrink-0 text-red-600 hover:text-red-700">
            Retry
          </Button>
        )}
      </div>
    </Alert>
  );
}

// 3. Empty State
interface EmptyProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

function Empty({ title, description, action, icon, className }: EmptyProps) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center ${className || ""}`}>
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// Compound Export
export const DataState = {
  Loading,
  Error: ErrorState,
  Empty,
};
