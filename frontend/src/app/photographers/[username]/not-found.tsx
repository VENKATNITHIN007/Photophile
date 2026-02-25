import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
          <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Photographer Not Found</h1>
        <p className="text-lg text-gray-500">
          The photographer profile you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        <div className="pt-4">
          <Button asChild size="lg">
            <Link href="/photographers">
              Browse Photographers
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}