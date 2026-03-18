import Image from "next/image";
import Link from "next/link";

const featured = [
  {
    name: "Marcus Chen",
    location: "Mumbai, India",
    rating: "4.9",
    price: "Starting at $250/hr",
    tags: ["Portrait", "Studio"],
    image:
      "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Sarah Jenkins",
    location: "Delhi, India",
    rating: "5.0",
    price: "Packages from $2k",
    tags: ["Wedding", "Events"],
    image:
      "https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "David Okafor",
    location: "Bangalore, India",
    rating: "4.8",
    price: "Starting at $150/hr",
    tags: ["Commercial", "Product"],
    image:
      "https://images.unsplash.com/photo-1621360841013-c76831f18529?q=80&w=800&auto=format&fit=crop",
  },
];

export function FeaturedPhotographers() {
  return (
    <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8 border-y border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Featured Professionals
            </h2>
            <p className="text-gray-600 text-lg">
              Top-rated professionals ready to bring your vision to life.
            </p>
          </div>
          <Link
            href="/photographers"
            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2 text-sm font-semibold uppercase tracking-wider"
          >
            Browse Directory
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((item) => (
            <div
              key={item.name}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={item.image}
                  alt={`${item.name} portfolio`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-white/90 backdrop-blur text-xs font-semibold text-gray-900 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 font-medium">{item.location}</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-bold text-gray-900">{item.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
                  <span className="text-sm font-medium text-gray-600">{item.price}</span>
                  <Link
                    href="/photographers"
                    className="text-sm font-bold text-blue-600 group-hover:text-blue-800 transition-colors"
                  >
                    View Profile &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedPhotographers;
