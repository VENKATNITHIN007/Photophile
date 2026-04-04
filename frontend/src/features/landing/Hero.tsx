import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white"></div>

      <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-start gap-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Top photographers in India
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-gray-900">
            Capture your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              masterpiece.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-lg leading-relaxed">
            Discover and book talented photographers for your next project, event, or creative vision without any hassle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
            <Button asChild size="lg" className="rounded-full text-base px-8 h-14">
              <Link href="/photographers">
                Find a Photographer
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full text-base px-8 h-14">
              <Link href="/become-photographer">Become a Photographer</Link>
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/5] lg:aspect-square rounded-2xl overflow-hidden group shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1554046920-90dc5f212265?q=80&w=2000&auto=format&fit=crop"
            alt="Professional photographer in action"
            fill
            className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-out"
            priority
          />

          <div className="absolute bottom-8 left-8 z-20 bg-white/95 backdrop-blur-md border border-gray-200 p-4 rounded-xl flex items-center gap-4 shadow-xl translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
            <div className="w-12 h-12 rounded-full overflow-hidden relative">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                alt="Avatar"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-gray-900 font-bold text-sm">Elena Rodriguez</div>
              <div className="text-blue-600 font-medium text-xs">Editorial & Fashion</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
