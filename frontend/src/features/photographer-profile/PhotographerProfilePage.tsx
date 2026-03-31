"use client";

import Link from "next/link";
import type { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProfileHeader } from "@/features/photographer-profile/ProfileHeader";
import { PortfolioGrid } from "@/features/photographer-profile/PortfolioGrid";
import {
  usePhotographerPortfolioQuery,
  usePhotographerProfileQuery,
} from "@/features/photographers/queries/photographers.queries";

interface PhotographerProfilePageProps {
  username: string;
}

export function PhotographerProfilePage({ username }: PhotographerProfilePageProps) {
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = usePhotographerProfileQuery(username);
  const { data: portfolio, isLoading: portfolioLoading } = usePhotographerPortfolioQuery(username);

  if (profileLoading || portfolioLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

  const isNotFound =
    profileError &&
    typeof profileError === "object" &&
    "response" in profileError &&
    (profileError as AxiosError).response?.status === 404;

  if (profileError && !isNotFound) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <EmptyState
            title="Unable to load profile"
            description="Please try again or return to the directory."
            action={
              <Button asChild variant="outline">
                <Link href="/photographers">Back to directory</Link>
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  if (!profile || isNotFound) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <EmptyState
            title="Photographer not found"
            description="The profile you are looking for does not exist or has been removed."
            action={
              <Button asChild variant="outline">
                <Link href="/photographers">Back to directory</Link>
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <ProfileHeader profile={profile} />
        <PortfolioGrid portfolio={portfolio || []} />
      </div>
    </div>
  );
}

export default PhotographerProfilePage;
