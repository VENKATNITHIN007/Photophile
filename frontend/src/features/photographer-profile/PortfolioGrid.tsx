import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { PortfolioItem } from "@/lib/types/photographer";

interface PortfolioGridProps {
  portfolio: PortfolioItem[];
}

export function PortfolioGrid({ portfolio }: PortfolioGridProps) {
  if (portfolio.length === 0) {
    return null;
  }

  return (
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
                <Badge
                  variant="secondary"
                  className="capitalize text-xs font-medium bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md"
                >
                  {item.category}
                </Badge>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PortfolioGrid;
