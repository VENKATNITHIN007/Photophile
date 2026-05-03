import React from "react";
import Link from "next/link";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import { ArrowRight } from "lucide-react";

/**
 * Editorial Onboarding CTA (Dark Variant).
 * Provides a very subtle, sophisticated contrast against the stark black footer.
 */
export function OnboardingCTA() {
  return (
    <Section variant="default" className="py-32 bg-zinc-900 text-white border-b border-zinc-800">
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 px-4">
        
        <div className="space-y-8 flex-1">
          <h2 className="text-4xl md:text-6xl font-light tracking-tight leading-tight">
            Start your <br />
            <span className="font-bold">photography studio.</span>
          </h2>
          
          <div className="flex flex-col gap-4 font-light text-gray-400 text-lg">
            <div className="flex items-center gap-4">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              <span>Claim your professional portfolio handle</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              <span>Connect directly with clients, commission-free</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 w-full md:w-auto">
          <Button asChild size="lg" className="w-full h-16 px-12 text-lg font-medium bg-white hover:bg-gray-200 text-black rounded-none">
            <Link href={ROUTES.AUTH.REGISTER}>
              Create Account
              <ArrowRight className="ml-3 size-5" />
            </Link>
          </Button>
        </div>

      </div>
    </Section>
  );
}
