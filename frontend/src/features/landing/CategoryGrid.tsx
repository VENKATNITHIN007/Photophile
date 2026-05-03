import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/Section";
import { ROUTES } from "@/lib/constants/routes";

const CATEGORIES = [
  { 
    name: "Wedding", 
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop", 
    href: `${ROUTES.DISCOVERY}?specialty=wedding` 
  },
  { 
    name: "Portrait", 
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop", 
    href: `${ROUTES.DISCOVERY}?specialty=portrait` 
  },
  { 
    name: "Fashion", 
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop", 
    href: `${ROUTES.DISCOVERY}?specialty=fashion` 
  },
  { 
    name: "Commercial", 
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop", 
    href: `${ROUTES.DISCOVERY}?specialty=commercial` 
  },
];

/**
 * Editorial Category Grid.
 * Gallery-style layout with sharp edges and hover-reveal text.
 */
export function CategoryGrid() {
  return (
    <Section variant="default" spacing="compact" className="py-24 bg-zinc-50">
      <Section.Header 
        title="Specialties" 
        align="left"
        className="mb-12 font-light tracking-wide uppercase text-sm text-gray-500"
      />
      
      <Section.Content className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
        {CATEGORIES.map((cat) => (
          <Link 
            key={cat.name} 
            href={cat.href}
            className="group relative h-[450px] overflow-hidden bg-gray-100"
          >
            <Image 
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Dark overlay that fades in slightly on hover */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-light text-white tracking-widest uppercase opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                {cat.name}
              </span>
            </div>
          </Link>
        ))}
      </Section.Content>
    </Section>
  );
}
