import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/Section";
import { ROUTES } from "@/lib/constants/routes";
import { ArrowRight } from "lucide-react";

/**
 * Editorial Photography Hero.
 * Uses a large, immersive background image to immediately establish the "photography" context.
 */
export function Hero() {
  return (
    <Section 
      spacing="none" 
      className="min-h-[calc(100vh-5rem)] flex items-center justify-center relative overflow-hidden bg-black"
    >
      {/* Immersive Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=2400&auto=format&fit=crop"
        alt="Photographer holding camera"
        fill
        priority
        className="object-cover opacity-60"
      />
      
      {/* Subtle overlay gradient to ensure text readability */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/80" />

      <div className="flex flex-col items-center text-center relative z-10 w-full max-w-5xl px-4">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-6 leading-tight">
          Find the perfect <br />
          <span className="italic font-light text-gray-300">photographer.</span>
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mb-12 font-light">
          Discover top talent for your next shoot, or build your own professional portfolio to get hired.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <Button asChild size="lg" className="w-full sm:w-auto h-14 px-10 text-base font-semibold bg-white hover:bg-gray-200 text-black hover:text-black rounded-none">
            <Link href={ROUTES.DISCOVERY}>
              Explore Portfolios
            </Link>
          </Button>
          
          <Button asChild size="lg" className="w-full sm:w-auto h-14 px-10 text-base font-semibold bg-transparent border border-white text-white hover:bg-white/10 hover:text-white rounded-none backdrop-blur-sm">
            <Link href={ROUTES.BECOME_PHOTOGRAPHER} className="flex items-center text-white hover:text-white">
              Join as Photographer
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
