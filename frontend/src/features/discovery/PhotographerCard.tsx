import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Page } from "@/components/Page";
import type { PhotographerListItem } from "@/lib/types/photographer";

interface PhotographerCardProps {
  photographer: PhotographerListItem;
}

export function PhotographerCard({ photographer }: PhotographerCardProps) {
  const name = photographer.userId?.fullName || "Anonymous";
  const avatar = photographer.userId?.avatar;
  const username = photographer.username;

  return (
    <Link href={`/photographers/${username}`} className="block h-full" data-testid="photographer-card">
      <Card variant="interactive" className="h-full">
        <CardHeader className="p-5 border-b bg-muted/30">
          <Page.Stack className="items-center gap-3">
            <Avatar size="lg" className="h-20 w-20 border-2 border-background shadow-sm">
              <AvatarImage src={avatar || undefined} alt={name} className="object-cover" />
              <AvatarFallback>{(name || username).charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground">@{username}</p>
            </div>
          </Page.Stack>
        </CardHeader>

        <CardContent className="p-5 pt-4">
          <Page.Stack className="gap-4">
            <Page.Row className="text-sm text-muted-foreground">
              <MapPin className="size-4 text-amber-500 shrink-0" />
              <span className="truncate capitalize">{photographer.location || "Location unlisted"}</span>
            </Page.Row>

            <p className="text-sm text-muted-foreground line-clamp-3 min-h-[4.5rem]">
              {photographer.bio || "No biography provided."}
            </p>

            {(() => {
              const specs = photographer.specialties || [];
              if (specs.length === 0) return null;
              return (
                <Page.Row className="flex-wrap gap-1.5">
                  {specs.slice(0, 3).map((spec) => (
                    <Badge key={spec} variant="outline" className="capitalize">
                      {spec}
                    </Badge>
                  ))}
                  {specs.length > 3 && (
                    <Badge variant="outline" className="text-[10px]">
                      +{specs.length - 3}
                    </Badge>
                  )}
                </Page.Row>
              );
            })()}
          </Page.Stack>
        </CardContent>

        <CardFooter className="p-4 bg-muted/30 border-t mt-auto">
          <Page.Row className="w-full justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Starting at</span>
            <span className="text-lg font-bold text-foreground">
              {photographer.priceFrom ? `$${photographer.priceFrom}` : "TBD"}
            </span>
          </Page.Row>
        </CardFooter>
      </Card>
    </Link>
  );
}
