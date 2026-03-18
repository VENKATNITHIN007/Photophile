import { Hero } from "@/features/landing/Hero";
import { FeaturedPhotographers } from "@/features/landing/FeaturedPhotographers";
import { HowItWorks } from "@/features/landing/HowItWorks";
import { FinalCta } from "@/features/landing/FinalCta";
import { Footer } from "@/components/shared/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Hero />
      <FeaturedPhotographers />
      <HowItWorks />
      <FinalCta />
      <Footer />
    </div>
  );
}
