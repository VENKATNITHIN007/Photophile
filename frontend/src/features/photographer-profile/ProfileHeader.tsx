import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { PhotographerProfile } from "@/lib/types/photographer";

interface ProfileHeaderProps {
  profile: PhotographerProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
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

          {(profile.location || (profile.specialties && profile.specialties.length > 0)) && (
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

          {profile.bio && (
            <p className="text-gray-700 leading-relaxed max-w-2xl mt-4">{profile.bio}</p>
          )}

          {profile.priceFrom && (
            <div className="text-lg font-medium text-gray-900 mt-2">Starting from ${profile.priceFrom}/hr</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileHeader;
