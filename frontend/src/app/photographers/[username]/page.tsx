import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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
        <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="shrink-0">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.fullName}
                width={150}
                height={150}
                className="rounded-full object-cover border-4 border-gray-50"
              />
            ) : (
              <div className="w-[150px] h-[150px] rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-semibold border-4 border-gray-50">
                {user.fullName.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
              <p className="text-lg text-gray-500">@{profile.username}</p>
            </div>
            
            {(profile.location || profile.specialties?.length) && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    📍 {profile.location}
                  </span>
                )}
                {profile.specialties && profile.specialties.length > 0 && (
                  <span className="flex items-center gap-1">
                    📷 {profile.specialties.join(", ")}
                  </span>
                )}
              </div>
            )}

            {reviewsData && reviewsData.totalReviews > 0 && (
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-yellow-400">★</span>
                <span className="font-medium text-gray-900">{reviewsData.averageRating}</span>
                <span className="text-gray-500">({reviewsData.totalReviews} reviews)</span>
              </div>
            )}

            {profile.bio && (
              <p className="text-gray-700 leading-relaxed max-w-2xl">
                {profile.bio}
              </p>
            )}

            {profile.priceFrom && (
              <div className="text-lg font-medium text-gray-900">
                Starting from ${profile.priceFrom}
              </div>
            )}
          </div>

          <div className="shrink-0 self-center md:self-start">
            <Link
              href={`/book/${profile.username}`}
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors shadow-sm"
            >
              Book Now
            </Link>
          </div>
        </div>

        {/* Portfolio Section */}
        {portfolio.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Portfolio</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {portfolio.map((item) => (
                <div key={item._id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                  {item.mediaType === "image" ? (
                    <Image
                      src={item.mediaUrl}
                      alt={item.category || "Portfolio image"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium capitalize">{item.category}</p>
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
                <div key={review._id} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                  <div className="flex items-center gap-4">
                    {review.userId.avatar ? (
                      <Image
                        src={review.userId.avatar}
                        alt={review.userId.fullName}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                        {review.userId.fullName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{review.userId.fullName}</h4>
                      <div className="flex text-yellow-400 text-sm">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < review.rating ? "opacity-100" : "opacity-30"}>★</span>
                        ))}
                      </div>
                    </div>
                    <span className="ml-auto text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
