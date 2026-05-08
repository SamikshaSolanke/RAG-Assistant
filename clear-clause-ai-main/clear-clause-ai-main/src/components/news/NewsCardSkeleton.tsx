import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface NewsCardSkeletonProps {
  viewMode: "grid" | "list";
}

export default function NewsCardSkeleton({
  viewMode,
}: NewsCardSkeletonProps) {
  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden border-border">
        <CardContent className="p-0">
          <div className="flex gap-4">
            {/* Image Skeleton */}
            <div className="w-32 h-32 flex-shrink-0">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>

            {/* Content Skeleton */}
            <div className="flex-1 py-4 pr-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid View Skeleton
  return (
    <Card className="overflow-hidden border-border flex flex-col">
      {/* Image Skeleton */}
      <div className="w-full h-48">
        <Skeleton className="w-full h-full rounded-t-lg" />
      </div>

      {/* Content Skeleton */}
      <CardContent className="flex-1 flex flex-col p-4 space-y-3">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />

        <div className="flex justify-between pt-4 border-t border-border">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
