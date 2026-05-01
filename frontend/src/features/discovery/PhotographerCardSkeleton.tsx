import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Page } from "@/components/Page";

/** Shimmer placeholder that mirrors the real PhotographerCard layout. */
export function PhotographerCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="p-5 border-b bg-muted/30">
        <Page.Stack className="items-center gap-3">
          {/* Avatar */}
          <div className="h-20 w-20 rounded-full bg-muted animate-pulse" />

          <div className="text-center space-y-2 w-full">
            {/* Name */}
            <div className="mx-auto h-5 w-32 rounded bg-muted animate-pulse" />
            {/* Username */}
            <div className="mx-auto h-4 w-20 rounded bg-muted animate-pulse" />
          </div>
        </Page.Stack>
      </CardHeader>

      <CardContent className="p-5 pt-4">
        <Page.Stack className="gap-4">
          {/* Location */}
          <div className="h-4 w-28 rounded bg-muted animate-pulse" />

          {/* Bio lines */}
          <div className="space-y-2 min-h-[4.5rem]">
            <div className="h-3 w-full rounded bg-muted animate-pulse" />
            <div className="h-3 w-5/6 rounded bg-muted animate-pulse" />
            <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
          </div>

          {/* Specialty badges */}
          <Page.Row className="flex-wrap gap-1.5">
            <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
            <div className="h-5 w-20 rounded-full bg-muted animate-pulse" />
            <div className="h-5 w-14 rounded-full bg-muted animate-pulse" />
          </Page.Row>
        </Page.Stack>
      </CardContent>

      <CardFooter className="p-4 bg-muted/30 border-t mt-auto">
        <Page.Row className="w-full justify-between">
          <div className="h-3 w-16 rounded bg-muted animate-pulse" />
          <div className="h-6 w-12 rounded bg-muted animate-pulse" />
        </Page.Row>
      </CardFooter>
    </Card>
  );
}

/** Grid of skeleton cards matching the real PhotographerGrid layout. */
export function PhotographerGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PhotographerCardSkeleton key={i} />
      ))}
    </div>
  );
}
