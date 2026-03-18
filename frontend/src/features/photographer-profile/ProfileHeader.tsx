import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { PhotographerProfile, ReviewsData } from "@/lib/types/photographer";

interface ProfileHeaderProps {
  profile: PhotographerProfile;
  reviewsData?: ReviewsData | null;
}

export function ProfileHeader({ profile, reviewsData }: ProfileHeaderProps) {
  const user = profile.userId;

  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
      <CardContent className="p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="shrink-0">
          {user.avatar ? (
            <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-white shadow-sm">
              <Image src={user.avatar} alt={user.fullName} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-[150px] h-[150px] rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-4xl font-semibold border-4 border-white shadow-sm">
              {user.fullName.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
            <p className="text-lg text-muted-foreground">@{profile.username}</p>
          </div>

          {(profile.location || profile.specialties?.length) && (
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-sm text-gray-600">
              {profile.location && (
                <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="capitalize">{profile.location}</span>
                </div>
              )}
              {profile.specialties && profile.specialties.length > 0 && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  {profile.specialties.map((spec) => (
                    <Badge key={spec} variant="secondary" className="capitalize font-normal text-sm">
                      {spec}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {reviewsData && reviewsData.totalReviews > 0 && (
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="flex items-center text-amber-500">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">{reviewsData.averageRating}</span>
              <span className="text-muted-foreground">({reviewsData.totalReviews} reviews)</span>
            </div>
          )}

          {profile.bio && (
            <p className="text-gray-700 leading-relaxed max-w-2xl mt-4">{profile.bio}</p>
          )}

          {profile.priceFrom && (
            <div className="text-lg font-medium text-gray-900 mt-2">Starting from ${profile.priceFrom}/hr</div>
          )}
        </div>

        <div className="shrink-0 self-center md:self-start">
          <Button asChild size="lg" className="px-8 shadow-md">
            <Link href={`/book/${profile.username}`}>Book Now</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileHeader;
