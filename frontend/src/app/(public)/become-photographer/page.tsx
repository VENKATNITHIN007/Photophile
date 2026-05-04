"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth";

const STEPS = [
  {
    title: "Create your public URL",
    description: "Pick a unique username for your shareable profile page.",
  },
  {
    title: "Add your portfolio",
    description: "Upload images and videos to showcase your style and quality.",
  },
  {
    title: "Receive direct inquiries",
    description: "Customers discover your page and contact you directly.",
  },
];

export default function BecomePhotographerPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handlePrimaryClick = () => {
    if (!user) {
      router.push("/register?redirect=%2Fphotographer%2Fonboard");
      return;
    }

    if (user.role === "photographer") {
      router.push("/photographer/dashboard");
      return;
    }

    router.push("/photographer/onboard");
  };

  const primaryLabel = loading
    ? "Loading..."
    : user?.role === "photographer"
      ? "Go to Photographer Dashboard"
      : "Start Photographer Onboarding";

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-5xl px-6 py-24 sm:py-32">
        <header className="space-y-8 border-b border-black pb-16">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-light">
              Professional Program
            </p>
            <h1 className="text-5xl md:text-7xl font-light uppercase tracking-widest text-black leading-none">
              The Studio <br />
              <span className="font-bold italic">Standard.</span>
            </h1>
          </div>
          <p className="max-w-xl text-lg font-light text-gray-600 leading-relaxed uppercase tracking-wide">
            Elevate your photography business with a professional portfolio that works as hard as you do.
          </p>
        </header>

        <section className="mt-20 grid gap-12 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <article key={step.title} className="space-y-6">
              <div className="text-4xl font-light italic text-gray-200 border-b border-gray-100 pb-4">
                0{index + 1}
              </div>
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-widest text-black">{step.title}</h2>
                <p className="text-sm font-light leading-relaxed text-gray-500 uppercase tracking-tighter">{step.description}</p>
              </div>
            </article>
          ))}
        </section>

        <footer className="mt-24 pt-16 border-t border-black">
          <div className="flex flex-col gap-6 sm:flex-row items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                size="lg"
                className="h-14 px-12 text-xs uppercase tracking-widest font-light bg-black text-white hover:bg-gray-900 rounded-none w-full sm:w-auto"
                onClick={handlePrimaryClick}
                disabled={loading}
              >
                {primaryLabel}
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-12 text-xs uppercase tracking-widest font-light border-black text-black hover:bg-black hover:text-white rounded-none w-full sm:w-auto">
                <Link href="/photographers">Explore Members</Link>
              </Button>
            </div>
            
            <Link 
              href="/login?redirect=%2Fphotographer%2Fdashboard"
              className="text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
            >
              Already a member? Sign in
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
