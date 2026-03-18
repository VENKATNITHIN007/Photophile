import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-900">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center"></div>
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Ready to frame your next project?</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            asChild
            size="lg"
            variant="default"
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white border-none h-14 px-8 text-base"
          >
            <Link href="/photographers">Explore Directory</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full bg-transparent text-white border-white hover:bg-white/10 hover:text-white h-14 px-8 text-base"
          >
            <Link href="/register">Join as a Professional</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default FinalCta;
