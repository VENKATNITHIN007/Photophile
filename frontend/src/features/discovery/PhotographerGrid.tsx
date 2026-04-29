import type { PhotographerListItem } from "@/lib/types/photographer";
import { PhotographerCard } from "./PhotographerCard";

interface PhotographerGridProps {
  photographers: PhotographerListItem[];
}

export function PhotographerGrid({ photographers }: PhotographerGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {photographers.map((photographer) => (
        <PhotographerCard key={photographer._id} photographer={photographer} />
      ))}
    </div>
  );
}

export default PhotographerGrid;
