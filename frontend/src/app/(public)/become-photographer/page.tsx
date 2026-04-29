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
    <main className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-5xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-12">
        <p className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-800">
          Photographer program
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Build your photographer page in minutes
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-gray-600">
          Create your public profile, share your username URL, and present your portfolio like a mini website.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step) => (
            <article key={step.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <h2 className="text-sm font-semibold text-gray-900">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">{step.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="bg-amber-600 text-white hover:bg-amber-700"
            onClick={handlePrimaryClick}
            disabled={loading}
          >
            {primaryLabel}
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/photographers">Browse photographers</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/login?redirect=%2Fphotographer%2Fdashboard">Already a photographer?</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
