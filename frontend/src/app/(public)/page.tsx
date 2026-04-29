import { Hero } from "@/features/landing/Hero";
import { CategoryHighlights } from "@/features/landing/CategoryHighlights";
import { WhyPhotophile } from "@/features/landing/WhyPhotophile";
import { FinalCta } from "@/features/landing/FinalCta";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Hero />
      <CategoryHighlights />
      <WhyPhotophile />
      <FinalCta />
      <Footer />
    </div>
  );
}
