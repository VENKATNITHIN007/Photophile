import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-gray-900 px-4 py-20 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.2),transparent_50%)]" />
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-extrabold text-white md:text-5xl">Ready to launch your profile?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-gray-200 md:text-lg">
          Build your photographer page, upload your best work, and start receiving direct inquiries.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            asChild
            size="lg"
            variant="default"
            className="mt-8 h-12 rounded-full bg-white px-8 text-base text-gray-900 hover:bg-gray-200"
          >
            <Link href="/photographers">Browse Photographers</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="mt-8 h-12 rounded-full border-white bg-transparent px-8 text-base text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/become-photographer">Become Photographer</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default FinalCta;
