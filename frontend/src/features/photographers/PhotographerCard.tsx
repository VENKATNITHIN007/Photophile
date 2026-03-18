import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { PhotographerListItem } from "@/lib/types/photographer";

interface PhotographerCardProps {
  photographer: PhotographerListItem;
}

export function PhotographerCard({ photographer }: PhotographerCardProps) {
  const name = photographer.userId?.fullName || "Anonymous";
  const avatar = photographer.userId?.avatar;

  return (
    <Link
      href={`/photographers/${photographer.username}`}
      className="group cursor-pointer block h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-md transition-shadow overflow-hidden">
        <CardHeader className="p-5 flex flex-col items-center border-b border-gray-100 bg-gray-50/50">
          <div className="h-20 w-20 rounded-full bg-gray-200 mb-3 overflow-hidden relative border border-gray-200">
            {avatar ? (
              <Image src={avatar} alt={name} fill className="object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-500 bg-gray-100 text-xl font-bold uppercase">
                {(name || photographer.username).charAt(0)}
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center truncate w-full group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <p className="text-sm text-gray-500">@{photographer.username}</p>
        </CardHeader>

        <CardContent className="p-5 flex-1 flex flex-col pt-4">
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="truncate capitalize">{photographer.location || "Location unlisted"}</span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
            {photographer.bio || "No biography provided."}
          </p>

          <div className="mt-auto">
            {photographer.specialties && photographer.specialties.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {photographer.specialties.slice(0, 3).map((spec) => (
                  <Badge key={spec} variant="secondary" className="capitalize font-normal px-2 py-0">
                    {spec}
                  </Badge>
                ))}
                {photographer.specialties.length > 3 && (
                  <Badge variant="outline" className="px-2 py-0 text-muted-foreground">
                    +{photographer.specialties.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 bg-gray-50/50 flex justify-between items-center border-t border-gray-100">
          <span className="text-sm text-gray-500">Starting at</span>
          <span className="text-lg font-bold text-gray-900">
            {photographer.priceFrom ? `$${photographer.priceFrom}` : "TBD"}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default PhotographerCard;
