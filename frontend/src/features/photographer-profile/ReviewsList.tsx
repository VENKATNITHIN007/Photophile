import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import type { ReviewsData } from "@/lib/types/photographer";

interface ReviewsListProps {
  reviewsData?: ReviewsData | null;
}

export function ReviewsList({ reviewsData }: ReviewsListProps) {
  if (!reviewsData || reviewsData.reviews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviewsData.reviews.map((review) => (
          <Card key={review._id} className="border-none shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                {review.userId.avatar ? (
                  <Image
                    src={review.userId.avatar}
                    alt={review.userId.fullName}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium">
                    {review.userId.fullName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">{review.userId.fullName}</h4>
                  <div className="flex text-amber-400 text-sm mt-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <svg
                        key={index}
                        className={`w-4 h-4 ${index < review.rating ? "fill-current" : "text-gray-200 fill-current"}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <span className="ml-auto text-sm text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.comment ? (
                <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ReviewsList;
