import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gray-950 px-4 pb-24 pt-24 text-white sm:px-6 lg:px-8 lg:pt-32">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2200&auto=format&fit=crop"
          alt="Photographer shooting outdoors"
          fill
          priority
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/85 to-black/40" />
        <div className="absolute -left-32 top-16 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-amber-100">
            India photographer directory
          </div>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Find photographers for your category.
            <span className="mt-2 block text-amber-300">Let&apos;s get started.</span>
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-200 sm:text-lg">
            Browse portfolios, compare specialties, and contact photographers directly through their public profile pages.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="h-12 rounded-full bg-white px-7 text-gray-900 hover:bg-gray-200">
              <Link href="/photographers">Find Photographers</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/60 bg-transparent px-7 text-white hover:bg-white/10"
            >
              <Link href="/become-photographer">Become Photographer</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/40 bg-transparent px-7 text-white hover:bg-white/10"
            >
              <Link href="/login?redirect=%2Fphotographer%2Fdashboard">Already a Photographer</Link>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md rounded-[2rem] border border-white/20 bg-white/10 p-5 backdrop-blur sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-200">What you get</p>
          <ul className="mt-5 space-y-3 text-sm text-gray-100 sm:text-base">
            <li className="rounded-xl bg-black/20 px-4 py-3">Shareable profile URL with your username</li>
            <li className="rounded-xl bg-black/20 px-4 py-3">Portfolio-first page that works like a mini website</li>
            <li className="rounded-xl bg-black/20 px-4 py-3">Direct client contact without booking complexity</li>
          </ul>
          <div className="mt-6 rounded-2xl border border-white/25 bg-white/10 p-4 text-sm text-amber-100">
            Built for quick MVP launch: profile, portfolio, and direct inquiries.
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-1 left-0 right-0 h-16 bg-[radial-gradient(120%_100%_at_50%_0%,transparent_40%,white_78%)]" />
    </section>
  );
}

export default Hero;
