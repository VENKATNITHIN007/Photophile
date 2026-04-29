"use client";

import Link from "next/link";
import type { AxiosError } from "axios";
import { Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Page } from "@/components/Page";
import { DataState } from "@/components/DataState";
import { usePhotographerPortfolioQuery, usePhotographerProfileQuery } from "./public-profile.queries";

interface PublicProfilePageProps {
  username: string;
}

export function PublicProfilePage({ username }: PublicProfilePageProps) {
  const { data: profile, isLoading: profileLoading, error: profileError } = usePhotographerProfileQuery(username);
  const { data: portfolio, isLoading: portfolioLoading } = usePhotographerPortfolioQuery(username);

  if (profileLoading || portfolioLoading) {
    return (
      <Page>
        <DataState.Loading className="min-h-screen" />
      </Page>
    );
  }

  const isNotFound =
    profileError &&
    typeof profileError === "object" &&
    "response" in profileError &&
    (profileError as AxiosError).response?.status === 404;

  if (profileError && !isNotFound) {
    return (
      <Page>
        <Page.Body>
          <DataState.Empty
            title="Unable to load photographer profile"
            description="Please try again or go back to the directory."
            action={
              <Button asChild variant="outline">
                <Link href="/photographers">Back to directory</Link>
              </Button>
            }
          />
        </Page.Body>
      </Page>
    );
  }

  if (!profile || isNotFound) {
    return (
      <Page>
        <Page.Body>
          <DataState.Empty
            title="Photographer not found"
            description="This profile does not exist anymore."
            action={
              <Button asChild variant="outline">
                <Link href="/photographers">Back to directory</Link>
              </Button>
            }
          />
        </Page.Body>
      </Page>
    );
  }

  const email = profile.userId.email;

  return (
    <Page>
      <Page.Body className="max-w-5xl flex-col gap-8">
        <Page.Surface className="p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Page.Title>{profile.userId.fullName}</Page.Title>
              <Page.Description>@{profile.username}</Page.Description>
              {profile.location ? (
                <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                  <MapPin className="size-4" />
                  <span className="capitalize">{profile.location}</span>
                </p>
              ) : null}
            </div>

            {email ? (
              <Button asChild className="bg-amber-600 text-white hover:bg-amber-700">
                <a href={`mailto:${email}`}>
                  <Mail className="mr-2 size-4" />
                  Contact via Email
                </a>
              </Button>
            ) : null}
          </div>

          {profile.bio ? <p className="mt-6 max-w-3xl text-sm leading-7 text-gray-700">{profile.bio}</p> : null}

          <div className="mt-6 flex flex-wrap gap-2">
            {profile.specialties?.map((specialty) => (
              <Badge key={specialty} variant="secondary" className="capitalize">
                {specialty}
              </Badge>
            ))}
            {profile.priceFrom ? (
              <Badge variant="outline">Starting at ${profile.priceFrom}</Badge>
            ) : null}
          </div>
        </Page.Surface>

        <Page.Surface className="p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Portfolio</h2>
          {portfolio?.length ? (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {portfolio.map((item) => (
                <article key={item._id} className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                  {item.mediaType === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.mediaUrl} alt={item.category || "Portfolio item"} className="aspect-square w-full object-cover" />
                  ) : (
                    <video src={item.mediaUrl} controls className="aspect-square w-full object-cover" />
                  )}
                  {item.category ? (
                    <p className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-600">{item.category}</p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-600">No portfolio uploaded yet.</p>
          )}
        </Page.Surface>
      </Page.Body>
    </Page>
  );
}

export default PublicProfilePage;
