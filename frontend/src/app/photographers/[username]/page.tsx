import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define Types based on API responses
interface UserProfile {
  _id: string;
  fullName: string;
  avatar: string | null;
  email: string;
}

interface PhotographerProfile {
  _id: string;
  userId: UserProfile;
  username: string;
  bio?: string;
  location?: string;
  specialties?: string[];
  priceFrom?: number;
}

interface PortfolioItem {
  _id: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  category?: string;
}

interface ReviewItem {
  _id: string;
  userId: UserProfile;
  rating: number;
  comment?: string;
  createdAt: string;
}

interface ReviewsData {
  reviews: ReviewItem[];
  averageRating: number;
  totalReviews: number;
}

async function getPhotographerProfile(username: string): Promise<PhotographerProfile | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
  try {
    const res = await fetch(`${baseUrl}/photographers/${username}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch photographer profile");
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching photographer profile:", error);
    return null;
  }
}

async function getPortfolio(username: string): Promise<PortfolioItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
  try {
    const res = await fetch(`${baseUrl}/portfolio/${username}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return [];
  }
}

async function getReviews(username: string): Promise<ReviewsData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
  try {
    const res = await fetch(`${baseUrl}/reviews/${username}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return null;
  }
}

export default async function PhotographerPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const resolvedParams = await params;
  const username = resolvedParams.username;

  // Fetch all data in parallel
  const [profile, portfolio, reviewsData] = await Promise.all([
    getPhotographerProfile(username),
    getPortfolio(username),
    getReviews(username),
  ]);

  if (!profile) {
    notFound();
  }

  const user = profile.userId;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Profile Header */}
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="shrink-0">
              {user.avatar ? (
                <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-white shadow-sm">
                  <Image
                    src={user.avatar}
                    alt={user.fullName}
                    fill
                    className="object-cover"
                  />
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="capitalize">{profile.location}</span>
                    </div>
                  )}
                  {profile.specialties && profile.specialties.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      {profile.specialties.map(spec => (
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
                <p className="text-gray-700 leading-relaxed max-w-2xl mt-4">
                  {profile.bio}
                </p>
              )}

              {profile.priceFrom && (
                <div className="text-lg font-medium text-gray-900 mt-2">
                  Starting from ${profile.priceFrom}/hr
                </div>
              )}
            </div>

            <div className="shrink-0 self-center md:self-start">
              <Button asChild size="lg" className="px-8 shadow-md">
                <Link href={`/book/${profile.username}`}>Book Now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Section */}
        {portfolio.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Portfolio</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {portfolio.map((item) => (
                <div key={item._id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group shadow-sm">
                  {item.mediaType === "image" ? (
                    <Image
                      src={item.mediaUrl}
                      alt={item.category || "Portfolio image"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <video
                      src={item.mediaUrl}
                      className="w-full h-full object-cover"
                      controls={false}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  )}
                  {item.category && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Badge variant="secondary" className="capitalize text-xs font-medium bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md">
                        {item.category}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {reviewsData && reviewsData.reviews.length > 0 && (
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
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-200 fill-current"}`} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <span className="ml-auto text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}